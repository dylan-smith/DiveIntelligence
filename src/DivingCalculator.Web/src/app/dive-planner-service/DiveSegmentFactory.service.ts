import { Injectable } from '@angular/core';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { DiveSegment } from './DiveSegment';
import { BreathingGas } from './BreathingGas';

@Injectable({
  providedIn: 'root',
})
export class DiveSegmentFactoryService {
  constructor(private humanDurationPipe: HumanDurationPipe) {}

  createEndDiveSegment(depth: number): DiveSegment {
    const ascentTime = (depth / 10) * 60;
    const ascentTimeDuration = this.humanDurationPipe.transform(ascentTime);

    return new DiveSegment(0, 0, 'Surface', `Ascent time: ${ascentTimeDuration} @ 10m/min`, 0, 0);
  }

  createStartDiveSegment(gas: BreathingGas): DiveSegment {
    return new DiveSegment(0, 0, 'Start Dive', gas.getDescription(), 0, 0);
  }
}
