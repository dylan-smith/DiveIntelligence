import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSettings } from './DiveSettings';

export class DiveProfile {
  public segments: DiveSegment[] = [];

  constructor(private diveSettings: DiveSettings) {}

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
  }

  removeLastSegment(): void {
    this.segments.pop();
  }

  extendLastSegment(time: number): void {
    this.getLastSegment().EndTimestamp += time;
  }

  getCurrentProfile(): DiveProfile {
    const result = new DiveProfile(this.diveSettings);
    result.segments = this.segments.slice(0, -1);
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
