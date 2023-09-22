import { BreathingGas } from './BreathingGas';

export class DiveSegment {
  constructor(
    public StartTimestamp: number,
    public EndTimestamp: number,
    public Title: string,
    public Description: string,
    public StartDepth: number,
    public EndDepth: number,
    public Gas: BreathingGas
  ) {}

  private readonly DESCENT_RATE_PER_METER = 3; // seconds per meter
  private readonly ASCENT_RATE_PER_METER = 6; // seconds per meter

  getDuration(): number {
    return this.EndTimestamp - this.StartTimestamp;
  }

  getAverageDepth(): number {
    if (this.StartDepth === this.EndDepth) {
      return this.StartDepth;
    }

    const travelAverageDepth = (this.StartDepth + this.EndDepth) / 2;
    const travelTime = this.getTravelDuration();
    const bottomTime = this.getDuration() - travelTime;

    return (travelAverageDepth * travelTime + this.EndDepth * bottomTime) / this.getDuration();
  }

  getDepth(time: number): number {
    if (time <= this.StartTimestamp) {
      return this.StartDepth;
    }

    if (time >= this.EndTimestamp) {
      return this.EndDepth;
    }

    const travelEnd = this.StartTimestamp + this.getTravelDuration();

    if (time >= travelEnd) {
      return this.EndDepth;
    }

    return this.StartDepth + ((this.EndDepth - this.StartDepth) * (time - this.StartTimestamp)) / (travelEnd - this.StartTimestamp);
  }

  getTravelDuration(): number {
    if (this.StartDepth === this.EndDepth) {
      return 0;
    }

    if (this.StartDepth < this.EndDepth) {
      return (this.EndDepth - this.StartDepth) * this.DESCENT_RATE_PER_METER;
    }

    if (this.EndDepth < this.StartDepth) {
      return (this.StartDepth - this.EndDepth) * this.ASCENT_RATE_PER_METER;
    }

    return 0; // should never happen
  }

  getDepthChartData(): { time: number; depth: number; ceiling: number }[] {
    const data: { time: number; depth: number; ceiling: number }[] = [];

    for (let i = this.StartTimestamp; i <= this.EndTimestamp; i++) {
      data.push({ time: i, depth: this.getDepth(i), ceiling: 0 });
    }

    return data;
  }

  getPO2ChartData(): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    const data: { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] = [];

    for (let i = this.StartTimestamp; i <= this.EndTimestamp; i++) {
      data.push({ time: i, pO2: this.Gas.getPO2(this.getDepth(i)), decoLimit: 1.6, limit: 1.4, min: 0.18 });
    }

    return data;
  }
}
