import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';

export class DiveProfile {
  public segments: DiveSegment[] = [];
  private profileByTime: Map<number, { depth: number; gas: BreathingGas }> = new Map();

  addSegment(segment: DiveSegment): void {
    this.segments.push(segment);

    // TODO: this can be optimized to only do the new segment breakdown
    this.breakDownByEachSecond();
  }

  removeLastSegment(): void {
    this.segments.pop();
    this.breakDownByEachSecond();
  }

  getMaxDepth(): number {
    return Math.max(...this.segments.map(x => x.EndDepth));
  }

  getAverageDepth(): number {
    if (this.profileByTime.size === 0) {
      return 0;
    }

    return (
      Array.from(this.profileByTime)
        .map(([, value]) => value.depth)
        .reduce((sum, current) => sum + current, 0) / this.profileByTime.size
    );
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
    if (time <= 0) {
      return 0;
    }

    const segment = this.getSegment(time);

    return segment.StartDepth + ((segment.EndDepth - segment.StartDepth) * (time - segment.StartTimestamp)) / (segment.EndTimestamp - segment.StartTimestamp);
  }

  getEND(time: number): number {
    return (this.getPN2(time) / 0.79 - 1) * 10;
  }

  breakDownByEachSecond(): void {
    this.profileByTime.clear();
    this.profileByTime.set(0, { depth: 0, gas: this.segments[0].Gas });

    for (let t = 1; t <= this.getTotalTime(); t++) {
      this.profileByTime.set(t, { depth: this.getDepth(t), gas: this.getGas(t) });
    }
  }
}
