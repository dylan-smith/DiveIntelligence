import { ceilingWithThreshold } from '../utility/utility';
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

    return ceilingWithThreshold(this.algo.getCeiling(currentTime));
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getCurrentDiveTime(): number {
    return this.getPreviousSegment().EndTimestamp;
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

    let minTime = 0;
    let maxTime = 200;

    wipProfile.extendLastSegment(maxTime);

    while (wipProfile.canSurfaceWithoutStops()) {
      minTime = maxTime;
      wipProfile.extendLastSegment(maxTime);
      maxTime *= 2;
    }

    maxTime--;
    let time = ceilingWithThreshold((maxTime - minTime) / 2) + minTime;

    wipProfile.shortenLastSegment(maxTime + 1 - time);

    while (minTime < maxTime) {
      if (wipProfile.canSurfaceWithoutStops()) {
        minTime = time;
        time = ceilingWithThreshold((maxTime - minTime) / 2) + minTime;
        wipProfile.extendLastSegment(time - minTime);
      } else {
        maxTime = time - 1;
        time = ceilingWithThreshold((maxTime - minTime) / 2) + minTime;
        wipProfile.shortenLastSegment(maxTime + 1 - time);
      }
    }

    return ndl + minTime;
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

    return ceilingWithThreshold(wipProfile.algo.getCeiling(wipProfile.getTotalTime()));
  }

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
    this.algo.calculateForSegment(segment);
  }

  getLastSegment(): DiveSegment {
    return this.segments[this.segments.length - 1];
  }

  getCurrentProfile(): DiveProfile {
    const result = this.clone();
    result.removeLastSegment();

    return result;
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

  private removeLastSegment(): void {
    this.segments.pop();
    this.algo.discardAfterTime(this.getTotalTime());
  }

  private extendLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp += time;
    // TODO: can improve perf by not recalculating whole segment, just the last bit of time
    this.algo.calculateForSegment(this.getLastSegment());
  }

  private shortenLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp -= time;
    // TODO: can improve perf by not recalculating whole segment, just throwing away some of the values instead
    this.algo.calculateForSegment(this.getLastSegment());
  }

  private clone(): DiveProfile {
    const result = new DiveProfile(this.diveSettings, this.diveSegmentFactory);
    result.algo = this.algo.clone();
    // TODO: is it a problem that we're doing a shallow copy here? segments are currently mutable
    // result.segments = this.segments.slice();
    result.segments = this.segments.map(x => x.clone());
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

  private getSegment(time: number): DiveSegment {
    return this.segments.find(x => x.EndTimestamp > time && x.StartTimestamp <= time) ?? this.getLastSegment();
  }

  private getGas(time: number): BreathingGas {
    return this.getSegment(time).Gas;
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
