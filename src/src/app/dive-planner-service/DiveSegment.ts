import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';

export class DiveSegment {
  constructor(
    public StartTimestamp: number,
    public EndTimestamp: number,
    public Title: string,
    public Description: string,
    public StartDepth: number,
    public EndDepth: number,
    public Gas: BreathingGas,
    public Icon: string,
    private settings: DiveSettingsService
  ) {}

  clone(): DiveSegment {
    return new DiveSegment(
      this.StartTimestamp,
      this.EndTimestamp,
      this.Title,
      this.Description,
      this.StartDepth,
      this.EndDepth,
      this.Gas,
      this.Icon,
      this.settings
    );
  }

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

  private getTravelDuration(): number {
    if (this.StartDepth === this.EndDepth) {
      return 0;
    }

    if (this.StartDepth < this.EndDepth) {
      const descentRatePerMeter = 60 / this.settings.descentRate;
      return Math.round((this.EndDepth - this.StartDepth) * descentRatePerMeter);
    }

    if (this.EndDepth < this.StartDepth) {
      const ascentRatePerMeter = 60 / this.settings.ascentRate;
      return Math.round((this.StartDepth - this.EndDepth) * ascentRatePerMeter);
    }

    return 0; // should never happen
  }
}
