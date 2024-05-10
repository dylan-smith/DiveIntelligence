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

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
    this.algo.calculateForSegment(segment);
  }

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

  removeLastSegment(): void {
    this.segments.pop();
    this.algo.discardAfterTime(this.getTotalTime());
  }

  extendLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp += time;
    this.algo.calculateForSegment(this.getLastSegment());
  }

  startDive(startGas: BreathingGas): void {
    this.addSegment(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.addSegment(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
  }

  clone(): DiveProfile {
    const result = new DiveProfile(this.diveSettings, this.diveSegmentFactory);
    result.algo = this.algo.clone();
    // TODO: is it a problem that we're doing a shallow copy here? segments are currently mutable
    result.segments = this.segments.slice();
    return result;
  }

  getCurrentProfile(): DiveProfile {
    const result = this.clone();
    result.removeLastSegment();

    return result;
  }

  getCurrentCeiling(): number {
    const currentTime = this.getPreviousSegment().EndTimestamp;

    return Math.ceil(this.algo.getCeiling(currentTime));
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getPreviousSegment(): DiveSegment {
    return this.segments[this.segments.length - 2];
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

  canSurfaceWithoutStops(): boolean {
    this.addSegment(
      this.diveSegmentFactory.createEndDiveSegment(this.getLastSegment().EndTimestamp, this.getLastSegment().EndDepth, this.getLastSegment().Gas)
    );

    const result = this.getCeilingError().duration === 0;
    this.removeLastSegment();

    return result;
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

  getLastSegment(): DiveSegment {
    return this.segments[this.segments.length - 1];
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

  getSegment(time: number): DiveSegment {
    return this.segments.find(x => x.EndTimestamp > time && x.StartTimestamp <= time) ?? this.getLastSegment();
  }

  getGas(time: number): BreathingGas {
    return this.getSegment(time).Gas;
  }

  getPO2(time: number): number {
    return this.getGas(time).getPO2(this.getDepth(time));
  }

  getPN2(time: number): number {
    return this.getGas(time).getPN2(this.getDepth(time));
  }

  getPHe(time: number): number {
    return this.getGas(time).getPHe(this.getDepth(time));
  }

  getDepth(time: number): number {
    return this.getSegment(time).getDepth(time);
  }

  getEND(time: number): number {
    if (this.diveSettings.isOxygenNarcotic) {
      return (this.getPN2(time) + this.getPO2(time) - 1) * 10;
    }

    return (this.getPN2(time) / 0.79 - 1) * 10;
  }
}
