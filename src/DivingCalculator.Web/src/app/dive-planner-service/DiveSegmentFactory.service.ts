import { Injectable } from '@angular/core';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { IDiveSegment } from './IDiveSegment';
import { BreathingGas } from './BreathingGas';

@Injectable({
  providedIn: 'root',
})
export class DiveSegmentFactoryService {
  constructor(private humanDurationPipe: HumanDurationPipe) {}

  createEndDiveSegment(depth: number): IDiveSegment {
    const ascentTime = (depth / 10) * 60;
    const ascentTimeDuration = this.humanDurationPipe.transform(ascentTime);

    return {
      Timestamp: 0,
      Title: 'Surface',
      Description: `Ascent time: ${ascentTimeDuration} @ 10m/min`,
    };
  }

  createStartDiveSegment(gas: BreathingGas): IDiveSegment {
    return {
      Timestamp: 0,
      Title: 'Start Dive',
      Description: gas.getDescription(),
    };
  }
}
