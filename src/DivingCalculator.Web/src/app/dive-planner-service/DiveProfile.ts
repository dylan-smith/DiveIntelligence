import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';

export class DiveProfile {
  public segments: DiveSegment[] = [];

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);
  }

  removeLastSegment(): void {
    this.segments.pop();
  }

  extendLastSegment(time: number): void {
    this.segments[this.segments.length - 1].EndTimestamp += time;
  }

  getMaxDepth(): number {
    return Math.max(...this.segments.map(x => x.EndDepth));
  }

  getAverageDepth(): number {
    return this.segments.reduce((sum, current) => sum + current.getAverageDepth() * current.getDuration(), 0) / this.getTotalTime();
  }

  getTotalTime(): number {
    return this.segments[this.segments.length - 1].EndTimestamp;
  }

  getSegment(time: number): DiveSegment {
    return this.segments.find(x => x.EndTimestamp > time && x.StartTimestamp <= time) ?? this.segments[this.segments.length - 1];
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
    return (this.getPN2(time) / 0.79 - 1) * 10;
  }
}
