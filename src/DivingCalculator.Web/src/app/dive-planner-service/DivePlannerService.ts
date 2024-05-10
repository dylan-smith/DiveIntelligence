import { Injectable } from '@angular/core';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveProfile } from './DiveProfile';
import { ApplicationInsightsService } from '../application-insights-service/application-insights.service';
import { DiveSettingsService } from './DiveSettings.service';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  private diveID = crypto.randomUUID();
  public diveProfile: DiveProfile = new DiveProfile(this.settings, this.diveSegmentFactory);

  constructor(
    private diveSegmentFactory: DiveSegmentFactoryService,
    private appInsights: ApplicationInsightsService,
    public settings: DiveSettingsService
  ) {
    BreathingGas.GenerateStandardGases(this.settings);
  }

  getStandardGases(): BreathingGas[] {
    return BreathingGas.StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.diveProfile.startDive(startGas);
    this.diveID = crypto.randomUUID();
    this.appInsights.trackEvent('StartDive', {
      diveID: this.diveID,
      startGas: { description: startGas.Description, oxygen: startGas.Oxygen, helium: startGas.Helium, nitrogen: startGas.Nitrogen },
    });
  }

  getDiveSegments(): DiveSegment[] {
    return this.diveProfile.segments;
  }

  getDiveDuration(): number {
    return this.diveProfile.getTotalTime();
  }

  getMaxDepth(): number {
    return this.diveProfile.getMaxDepth();
  }

  getAverageDepth(): number {
    return this.diveProfile.getAverageDepth();
  }

  getPreviousSegment(): DiveSegment {
    return this.diveProfile.getPreviousSegment();
  }

  getCurrentDepth(): number {
    return this.getPreviousSegment().EndDepth;
  }

  getOptimalDecoGas(depth: number): BreathingGas {
    return BreathingGas.getOptimalDecoGas(depth, this.settings);
  }

  getCurrentCeiling(): number {
    return this.diveProfile.getCurrentCeiling();
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number | undefined {
    return this.diveProfile.getNoDecoLimit(newDepth, newGas);
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    const newProfile = this.diveProfile.getCurrentProfile();

    let previousSegment = newProfile.getLastSegment();
    let startTime = previousSegment.EndTimestamp;

    if (newDepth === previousSegment.EndDepth && previousSegment.Gas.isEquivalent(newGas) && timeAtDepth > 0) {
      newProfile.extendLastSegment(timeAtDepth);
    }

    if (newDepth !== previousSegment.EndDepth) {
      if (previousSegment.Gas.isEquivalent(newGas)) {
        newProfile.addSegment(
          this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, timeAtDepth, previousSegment.Gas)
        );
      } else {
        newProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, 0, previousSegment.Gas));
      }
    }

    previousSegment = newProfile.getLastSegment();
    startTime = previousSegment.EndTimestamp;

    if (!previousSegment.Gas.isEquivalent(newGas)) {
      newProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, timeAtDepth, newDepth));
    }

    const endTime = newProfile.getLastSegment().EndTimestamp;

    newProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(endTime, newDepth, newGas));
    this.diveProfile = newProfile;

    this.appInsights.trackEvent('AddDiveSegment', {
      diveID: this.diveID,
      newDepth,
      newGas: { description: newGas.Description, oxygen: newGas.Oxygen, helium: newGas.Helium, nitrogen: newGas.Nitrogen },
      timeAtDepth,
    });
  }

  getTravelTime(newDepth: number): number {
    return this.diveSegmentFactory.getTravelTime(this.getCurrentDepth(), newDepth);
  }

  getDepthChartData(): { time: number; depth: number; ceiling: number }[] {
    let data: { time: number; depth: number; ceiling: number }[] = [];

    for (const segment of this.diveProfile.segments) {
      data = [...data, ...segment.getDepthChartData()];
    }

    for (const d of data) {
      d.ceiling = this.diveProfile.algo.getCeiling(d.time);
    }

    return data;
  }

  getPO2ChartData(): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    let data: { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] = [];

    for (const segment of this.diveProfile.segments) {
      data = [...data, ...segment.getPO2ChartData()];
    }

    return data;
  }

  getENDChartData(): { time: number; end: number; errorLimit: number }[] {
    let data: { time: number; end: number; errorLimit: number }[] = [];

    for (const segment of this.diveProfile.segments) {
      data = [...data, ...segment.getENDChartData()];
    }

    return data;
  }

  getTissuesCeilingChartData(): { time: number; depth: number; tissuesCeiling: number[] }[] {
    const data: {
      time: number;
      depth: number;
      tissuesCeiling: number[];
    }[] = [];

    for (const segment of this.diveProfile.segments) {
      for (const d of segment.getDepthChartData()) {
        const ceilings: number[] = [];
        for (let i = 1; i <= 16; i++) {
          ceilings.push(this.diveProfile.algo.getTissueCeiling(d.time, i));
        }

        data.push({
          time: d.time,
          depth: d.depth,
          tissuesCeiling: ceilings,
        });
      }
    }

    return data;
  }

  getTissuesPN2ChartData(): { time: number; gasPN2: number; tissuesPN2: number[] }[] {
    const data: {
      time: number;
      gasPN2: number;
      tissuesPN2: number[];
    }[] = [];

    for (let t = 0; t <= this.diveProfile.getTotalTime(); t++) {
      const tissuesPN2: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPN2.push(this.diveProfile.algo.getTissuePN2(t, i));
      }

      data.push({
        time: t,
        gasPN2: this.diveProfile.getPN2(t),
        tissuesPN2,
      });
    }

    return data;
  }

  getTissuesPHeChartData(): { time: number; gasPHe: number; tissuesPHe: number[] }[] {
    const data: {
      time: number;
      gasPHe: number;
      tissuesPHe: number[];
    }[] = [];

    for (let t = 0; t <= this.diveProfile.getTotalTime(); t++) {
      const tissuesPHe: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPHe.push(this.diveProfile.algo.getTissuePHe(t, i));
      }

      data.push({
        time: t,
        gasPHe: this.diveProfile.getPHe(t),
        tissuesPHe,
      });
    }

    return data;
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas): { time: number; ceiling: number }[] {
    const data: { time: number; ceiling: number }[] = [];

    const wipProfile = this.diveProfile.getCurrentProfile();

    wipProfile.addSegment(
      this.diveSegmentFactory.createDepthChangeSegment(
        wipProfile.getLastSegment().EndTimestamp,
        wipProfile.getLastSegment().EndDepth,
        newDepth,
        0,
        this.getCurrentGas()
      )
    );

    const startTime = wipProfile.getTotalTime();
    const chartDuration = 3600 * 2;

    wipProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(wipProfile.getLastSegment().EndTimestamp, newGas, chartDuration, newDepth));

    for (let t = startTime; t < startTime + chartDuration; t++) {
      data.push({ time: t - startTime, ceiling: wipProfile.algo.getCeiling(t) });
    }

    return data;
  }

  getNewCeiling(newDepth: number, newGas: BreathingGas, timeAtDepth: number): number {
    const wipProfile = this.diveProfile.getCurrentProfile();

    wipProfile.addSegment(
      this.diveSegmentFactory.createDepthChangeSegment(
        wipProfile.getLastSegment().EndTimestamp,
        wipProfile.getLastSegment().EndDepth,
        newDepth,
        0,
        this.getCurrentGas()
      )
    );

    wipProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(wipProfile.getLastSegment().EndTimestamp, newGas, timeAtDepth, newDepth));

    return Math.ceil(wipProfile.algo.getCeiling(wipProfile.getTotalTime()));
  }

  getCeilingError(): { amount: number; duration: number } {
    return this.diveProfile.getCeilingError();
  }

  getPO2Error(): { maxPO2: number; duration: number } {
    let maxPO2 = 0;
    let duration = 0;

    for (let t = 0; t < this.getDiveDuration(); t++) {
      const pO2 = this.diveProfile.getPO2(t);

      if (pO2 > this.settings.decoPO2Maximum) {
        maxPO2 = Math.max(maxPO2, pO2);
        duration++;
      }
    }

    return { maxPO2, duration };
  }

  getHypoxicError(): { minPO2: number; duration: number } {
    let minPO2 = 999;
    let duration = 0;

    for (let t = 0; t < this.getDiveDuration(); t++) {
      const pO2 = this.diveProfile.getPO2(t);

      if (pO2 < this.settings.pO2Minimum) {
        minPO2 = Math.min(minPO2, pO2);
        duration++;
      }
    }

    return { minPO2, duration };
  }

  getENDError(): { end: number; duration: number } {
    let maxEND = 0;
    let duration = 0;

    for (let t = 0; t < this.getDiveDuration(); t++) {
      const end = this.diveProfile.getEND(t);

      if (end > this.settings.ENDErrorThreshold) {
        maxEND = Math.max(end, maxEND);
        duration++;
      }
    }

    return { end: maxEND, duration };
  }
}
