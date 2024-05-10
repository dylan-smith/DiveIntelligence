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
    return this.diveProfile.getCurrentDepth();
  }

  getOptimalDecoGas(depth: number): BreathingGas {
    return BreathingGas.getOptimalDecoGas(depth, this.settings);
  }

  getCurrentCeiling(): number {
    return this.diveProfile.getCurrentCeiling();
  }

  getCurrentGas(): BreathingGas {
    return this.diveProfile.getCurrentGas();
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number | undefined {
    return this.diveProfile.getNoDecoLimit(newDepth, newGas);
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    this.diveProfile.addDiveSegment(newDepth, newGas, timeAtDepth);

    this.appInsights.trackEvent('AddDiveSegment', {
      diveID: this.diveID,
      newDepth,
      newGas: { description: newGas.Description, oxygen: newGas.Oxygen, helium: newGas.Helium, nitrogen: newGas.Nitrogen },
      timeAtDepth,
    });
  }

  getTravelTime(newDepth: number): number {
    return this.diveProfile.getTravelTime(newDepth);
  }

  getDepthChartData(): { time: number; depth: number; ceiling: number }[] {
    return this.diveProfile.getDepthChartData();
  }

  getPO2ChartData(): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    return this.diveProfile.getPO2ChartData();
  }

  getENDChartData(): { time: number; end: number; errorLimit: number }[] {
    return this.diveProfile.getENDChartData();
  }

  getTissuesCeilingChartData(): { time: number; depth: number; tissuesCeiling: number[] }[] {
    return this.diveProfile.getTissuesCeilingChartData();
  }

  getTissuesPN2ChartData(): { time: number; gasPN2: number; tissuesPN2: number[] }[] {
    return this.diveProfile.getTissuesPN2ChartData();
  }

  getTissuesPHeChartData(): { time: number; gasPHe: number; tissuesPHe: number[] }[] {
    return this.diveProfile.getTissuesPHeChartData();
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas): { time: number; ceiling: number }[] {
    return this.diveProfile.getCeilingChartData(newDepth, newGas);
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
