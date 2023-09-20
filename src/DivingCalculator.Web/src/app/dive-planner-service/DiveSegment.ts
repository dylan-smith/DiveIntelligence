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

  getDuration(): number {
    return this.EndTimestamp - this.StartTimestamp;
  }

  getAverageDepth(): number {
    return (this.StartDepth + this.EndDepth) / 2;
  }
}
