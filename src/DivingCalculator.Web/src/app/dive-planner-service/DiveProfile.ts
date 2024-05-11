import { BreathingGas } from './BreathingGas';
import { BuhlmannZHL16C } from './BuhlmannZHL16C';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveSettingsService } from './DiveSettings.service';

export class DiveProfile {
  public segments: DiveSegment[] = [];
  public algo: BuhlmannZHL16C = new BuhlmannZHL16C();

  constructor(
    private diveSettings: DiveSettingsService,
    private diveSegmentFactory: DiveSegmentFactoryService
  ) {}

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    this.removeLastSegment();

    let previousSegment = this.getLastSegment();
    let startTime = previousSegment.EndTimestamp;

    if (newDepth === previousSegment.EndDepth && previousSegment.Gas.isEquivalent(newGas) && timeAtDepth > 0) {
      this.extendLastSegment(timeAtDepth);
    }

    if (newDepth !== previousSegment.EndDepth) {
      if (previousSegment.Gas.isEquivalent(newGas)) {
        this.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, timeAtDepth, previousSegment.Gas));
      } else {
        this.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, 0, previousSegment.Gas));
      }
    }

    previousSegment = this.getLastSegment();
    startTime = previousSegment.EndTimestamp;

    if (!previousSegment.Gas.isEquivalent(newGas)) {
      this.addSegment(this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, timeAtDepth, newDepth));
    }

    const endTime = this.getLastSegment().EndTimestamp;

    this.addSegment(this.diveSegmentFactory.createEndDiveSegment(endTime, newDepth, newGas));
  }

  getCurrentDepth(): number {
    return this.getPreviousSegment().EndDepth;
  }

  getTravelTime(newDepth: number): number {
    return this.diveSegmentFactory.getTravelTime(this.getCurrentDepth(), newDepth);
  }

  startDive(startGas: BreathingGas): void {
    this.addSegment(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.addSegment(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
  }

  getCurrentCeiling(): number {
    const currentTime = this.getPreviousSegment().EndTimestamp;

    return Math.ceil(this.algo.getCeiling(currentTime));
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number | undefined {
    const wipProfile = this.getCurrentProfile();

    wipProfile.addSegment(
      this.diveSegmentFactory.createDepthChangeSegment(
        wipProfile.getLastSegment().EndTimestamp,
        wipProfile.getLastSegment().EndDepth,
        newDepth,
        0,
        this.segments[this.segments.length - 2].Gas
      )
    );

    wipProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(wipProfile.getTotalTime(), newGas, 0, newDepth));

    const ndl = wipProfile.algo.getTimeToCeiling(newDepth, newGas);

    if (ndl === undefined) {
      return undefined;
    }

    wipProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(wipProfile.getTotalTime(), newDepth, newDepth, ndl, newGas));

    let time = 0;

    // TODO: could use a binary search here for performance (instead of stepping 1 second at a time)
    while (wipProfile.canSurfaceWithoutStops()) {
      time++;
      wipProfile.extendLastSegment(1);
    }

    return ndl + (time - 1);
  }

  // TODO: memoize this and only recalculate on the new segment bits
  getCeilingError(): { amount: number; duration: number } {
    let amount = 0;
    let duration = 0;

    for (let t = 0; t < this.getTotalTime(); t++) {
      const ceiling = this.algo.getCeiling(t);
      const depth = this.getDepth(t);

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

    for (let t = 0; t < this.getTotalTime(); t++) {
      const pO2 = this.getPO2(t);

      if (pO2 > this.diveSettings.decoPO2Maximum) {
        maxPO2 = Math.max(maxPO2, pO2);
        duration++;
      }
    }

    return { maxPO2, duration };
  }

  getHypoxicError(): { minPO2: number; duration: number } {
    let minPO2 = 999;
    let duration = 0;

    for (let t = 0; t < this.getTotalTime(); t++) {
      const pO2 = this.getPO2(t);

      if (pO2 < this.diveSettings.pO2Minimum) {
        minPO2 = Math.min(minPO2, pO2);
        duration++;
      }
    }

    return { minPO2, duration };
  }

  getENDError(): { end: number; duration: number } {
    let maxEND = 0;
    let duration = 0;

    for (let t = 0; t < this.getTotalTime(); t++) {
      const end = this.getEND(t);

      if (end > this.diveSettings.ENDErrorThreshold) {
        maxEND = Math.max(end, maxEND);
        duration++;
      }
    }

    return { end: maxEND, duration };
  }

  getMaxDepth(): number {
    return Math.max(...this.segments.map(x => x.EndDepth));
  }

  getAverageDepth(): number {
    if (this.getTotalTime() === 0) return 0;
    return this.segments.reduce((sum, current) => sum + current.getAverageDepth() * current.getDuration(), 0) / this.getTotalTime();
  }

  getTotalTime(): number {
    if (this.segments.length === 0) return 0;

    return this.getLastSegment().EndTimestamp;
  }

  getNewCeiling(newDepth: number, newGas: BreathingGas, timeAtDepth: number): number {
    const wipProfile = this.getCurrentProfile();

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

  getDepthChartData(): { time: number; depth: number; ceiling: number }[] {
    let data: { time: number; depth: number; ceiling: number }[] = [];

    for (const segment of this.segments) {
      data = [...data, ...segment.getDepthChartData()];
    }

    for (const d of data) {
      d.ceiling = this.algo.getCeiling(d.time);
    }

    return data;
  }

  getPO2ChartData(): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    let data: { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] = [];

    for (const segment of this.segments) {
      data = [...data, ...segment.getPO2ChartData()];
    }

    return data;
  }

  getENDChartData(): { time: number; end: number; errorLimit: number }[] {
    let data: { time: number; end: number; errorLimit: number }[] = [];

    for (const segment of this.segments) {
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

    for (const segment of this.segments) {
      for (const d of segment.getDepthChartData()) {
        const ceilings: number[] = [];
        for (let i = 1; i <= 16; i++) {
          ceilings.push(this.algo.getTissueCeiling(d.time, i));
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

    for (let t = 0; t <= this.getTotalTime(); t++) {
      const tissuesPN2: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPN2.push(this.algo.getTissuePN2(t, i));
      }

      data.push({
        time: t,
        gasPN2: this.getPN2(t),
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

    for (let t = 0; t <= this.getTotalTime(); t++) {
      const tissuesPHe: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPHe.push(this.algo.getTissuePHe(t, i));
      }

      data.push({
        time: t,
        gasPHe: this.getPHe(t),
        tissuesPHe,
      });
    }

    return data;
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas): { time: number; ceiling: number }[] {
    const data: { time: number; ceiling: number }[] = [];

    const wipProfile = this.getCurrentProfile();

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

  private addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
    this.algo.calculateForSegment(segment);
  }

  private removeLastSegment(): void {
    this.segments.pop();
    this.algo.discardAfterTime(this.getTotalTime());
  }

  private extendLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp += time;
    this.algo.calculateForSegment(this.getLastSegment());
  }

  private clone(): DiveProfile {
    const result = new DiveProfile(this.diveSettings, this.diveSegmentFactory);
    result.algo = this.algo.clone();
    // TODO: is it a problem that we're doing a shallow copy here? segments are currently mutable
    result.segments = this.segments.slice();
    return result;
  }

  private getCurrentProfile(): DiveProfile {
    const result = this.clone();
    result.removeLastSegment();

    return result;
  }

  private getPreviousSegment(): DiveSegment {
    return this.segments[this.segments.length - 2];
  }

  private canSurfaceWithoutStops(): boolean {
    this.addSegment(
      this.diveSegmentFactory.createEndDiveSegment(this.getLastSegment().EndTimestamp, this.getLastSegment().EndDepth, this.getLastSegment().Gas)
    );

    const result = this.getCeilingError().duration === 0;
    this.removeLastSegment();

    return result;
  }

  private getLastSegment(): DiveSegment {
    return this.segments[this.segments.length - 1];
  }

  private getSegment(time: number): DiveSegment {
    return this.segments.find(x => x.EndTimestamp > time && x.StartTimestamp <= time) ?? this.getLastSegment();
  }

  private getGas(time: number): BreathingGas {
    return this.getSegment(time).Gas;
  }

  private getPO2(time: number): number {
    return this.getGas(time).getPO2(this.getDepth(time));
  }

  private getPN2(time: number): number {
    return this.getGas(time).getPN2(this.getDepth(time));
  }

  private getPHe(time: number): number {
    return this.getGas(time).getPHe(this.getDepth(time));
  }

  private getDepth(time: number): number {
    return this.getSegment(time).getDepth(time);
  }

  private getEND(time: number): number {
    if (this.diveSettings.isOxygenNarcotic) {
      return (this.getPN2(time) + this.getPO2(time) - 1) * 10;
    }

    return (this.getPN2(time) / 0.79 - 1) * 10;
  }
}
