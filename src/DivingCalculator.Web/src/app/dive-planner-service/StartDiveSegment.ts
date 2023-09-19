import { BreathingGas } from './BreathingGas';
import { IDiveSegment } from './IDiveSegment';

export class StartDiveSegment implements IDiveSegment {
  Timestamp: number;
  Title: string;
  Description: string;

  constructor(gas: BreathingGas) {
    this.Timestamp = 0;
    this.Title = 'Start Dive';
    this.Description = gas.getDescription();
  }
}
