import { BreathingGas } from './BreathingGas';
import { BuhlmannZHL16C } from './BuhlmannZHL16C';
import { DiveSegment } from './DiveSegment';
import { DiveSettingsService } from './DiveSettings.service';

export class DiveProfile {
  public segments: DiveSegment[] = [];
  public algo: BuhlmannZHL16C = new BuhlmannZHL16C();

  constructor(private diveSettings: DiveSettingsService) {}

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
    this.algo.calculateForSegment(segment);
  }

  removeLastSegment(): void {
    this.segments.pop();
    this.algo.discardAfterTime(this.getTotalTime());
  }

  extendLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp += time;
    this.algo.calculateForSegment(this.getLastSegment());
  }

  clone(): DiveProfile {
    const result = new DiveProfile(this.diveSettings);
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
