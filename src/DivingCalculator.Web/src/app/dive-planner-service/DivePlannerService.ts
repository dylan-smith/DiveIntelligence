import { Injectable } from '@angular/core';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveProfile } from './DiveProfile';
import { BuhlmannZHL16C } from './BuhlmannZHL16C';
import { ApplicationInsightsService } from '../application-insights-service/application-insights.service';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  public diveProfile: DiveProfile = new DiveProfile();
  private diveID = crypto.randomUUID();

  constructor(
    private diveSegmentFactory: DiveSegmentFactoryService,
    private appInsights: ApplicationInsightsService
  ) {}

  private DESCENT_RATE = 3; // seconds per meter
  private ASCENT_RATE = 6; // seconds per meter

  getStandardGases(): BreathingGas[] {
    return BreathingGas.StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.diveID = crypto.randomUUID();
    this.appInsights.trackEvent('StartDive', {
      diveID: this.diveID,
      startGas: { description: startGas.Description, oxygen: startGas.Oxygen, helium: startGas.Helium, nitrogen: startGas.Nitrogen },
    });
    this.diveProfile.addSegment(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.diveProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
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
    return this.diveProfile.segments[this.diveProfile.segments.length - 2];
  }

  getCurrentDepth(): number {
    return this.getPreviousSegment().EndDepth;
  }

  getOptimalDecoGas(depth: number): BreathingGas {
    const atm = depth / 10 + 1;
    const oxygen = Math.min(100, Math.floor(160 / atm));

    const targetPN2 = 5 * 0.79;
    let nitrogen = (targetPN2 / atm) * 100;
    const helium = Math.max(0, Math.ceil(100 - oxygen - nitrogen));
    nitrogen = 100 - oxygen - helium;

    return new BreathingGas('Custom', oxygen, helium, nitrogen);
  }

  getCurrentCeiling(): number {
    const currentTime = this.getPreviousSegment().EndTimestamp;

    return Math.ceil(new BuhlmannZHL16C(this.diveProfile).getCeiling(currentTime));
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number | undefined {
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
    const algo = new BuhlmannZHL16C(wipProfile);

    const ndl = algo.getNoDecoLimit(newDepth, newGas);

    if (ndl === undefined) {
      return undefined;
    }

    const timeToSurface = this.diveSegmentFactory.getTravelTime(wipProfile.getLastSegment().EndDepth, 0);
    return Math.max(0, ndl - timeToSurface);
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    // remove the final surface segment, will re-add it below
    this.diveProfile.removeLastSegment();

    let previousSegment = this.diveProfile.segments[this.diveProfile.segments.length - 1];
    let startTime = previousSegment.EndTimestamp;

    if (newDepth === previousSegment.EndDepth && previousSegment.Gas.isEquivalent(newGas) && timeAtDepth > 0) {
      this.diveProfile.extendLastSegment(timeAtDepth);
    }

    if (newDepth !== previousSegment.EndDepth) {
      if (previousSegment.Gas.isEquivalent(newGas)) {
        this.diveProfile.addSegment(
          this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, timeAtDepth, previousSegment.Gas)
        );
      } else {
        this.diveProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, 0, previousSegment.Gas));
      }
    }

    previousSegment = this.diveProfile.segments[this.diveProfile.segments.length - 1];
    startTime = previousSegment.EndTimestamp;

    if (!previousSegment.Gas.isEquivalent(newGas)) {
      this.diveProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, timeAtDepth, newDepth));
    }

    const endTime = this.diveProfile.segments[this.diveProfile.segments.length - 1].EndTimestamp;

    this.diveProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(endTime, newDepth, newGas));

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

    const algo = new BuhlmannZHL16C(this.diveProfile);

    for (const d of data) {
      d.ceiling = algo.getCeiling(d.time);
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

  getENDChartData(): { time: number; end: number; warningLimit: number; errorLimit: number }[] {
    let data: { time: number; end: number; warningLimit: number; errorLimit: number }[] = [];

    for (const segment of this.diveProfile.segments) {
      data = [...data, ...segment.getENDChartData()];
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
    const algo = new BuhlmannZHL16C(wipProfile);

    for (let t = startTime; t < startTime + chartDuration; t++) {
      data.push({ time: t - startTime, ceiling: algo.getCeiling(t) });
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
    const algo = new BuhlmannZHL16C(wipProfile);

    return Math.ceil(algo.getCeiling(wipProfile.getTotalTime()));
  }

  getCeilingError(): { amount: number; duration: number } {
    let amount = 0;
    let duration = 0;
    const algo = new BuhlmannZHL16C(this.diveProfile);

    for (let t = 0; t < this.getDiveDuration(); t++) {
      const ceiling = algo.getCeiling(t);
      const depth = this.diveProfile.getDepth(t);

      if (depth < ceiling) {
        amount = Math.max(amount, ceiling - depth);
        duration++;
      }
    }

    return { amount, duration };
  }

  getPO2Error(): { maxPO2: number; duration: number } {
    let maxPO2 = 0;
    let duration = 0;

    for (let t = 0; t < this.getDiveDuration(); t++) {
      const pO2 = this.diveProfile.getPO2(t);

      if (pO2 > 1.6) {
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

      if (pO2 < 0.18) {
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

      if (end > 40) {
        maxEND = Math.max(end, maxEND);
        duration++;
      }
    }

    return { end: maxEND, duration };
  }
}
