import { Injectable } from '@angular/core';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { DiveSegment } from './DiveSegment';
import { BreathingGas } from './BreathingGas';

@Injectable({
  providedIn: 'root',
})
export class DiveSegmentFactoryService {
  constructor(private humanDurationPipe: HumanDurationPipe) {}

  createEndDiveSegment(startTime: number, depth: number, gas: BreathingGas, ascentRate: number): DiveSegment {
    const ascentTime = this.getTravelTime(depth, 0, 0, ascentRate);
    const ascentTimeDuration = this.humanDurationPipe.transform(ascentTime);
    const endTime = startTime + ascentTime;

    return new DiveSegment(startTime, endTime, 'Surface', `Ascent time: ${ascentTimeDuration} @ ${ascentRate}m/min`, depth, 0, gas, 'done', 0, ascentRate);
  }

  createStartDiveSegment(gas: BreathingGas): DiveSegment {
    return new DiveSegment(0, 0, 'Start Dive', gas.Description, 0, 0, gas, 'scuba_diving', 0, 0);
  }

  createDepthChangeSegment(
    startTime: number,
    previousDepth: number,
    newDepth: number,
    duration: number,
    gas: BreathingGas,
    descentRate: number,
    ascentRate: number
  ) {
    const descentTime = this.getTravelTime(previousDepth, newDepth, descentRate, ascentRate);
    const endTime = startTime + descentTime + duration;
    const title = newDepth > previousDepth ? `Descend to ${newDepth}m` : `Ascend to ${newDepth}m`;
    const description =
      newDepth > previousDepth
        ? `Descent time: ${this.humanDurationPipe.transform(descentTime)} @ ${descentRate}m/min`
        : `Ascent time: ${this.humanDurationPipe.transform(descentTime)} @ ${ascentRate}m/min`;
    const icon = newDepth > previousDepth ? 'arrow_downward' : 'arrow_upward';

    return new DiveSegment(startTime, endTime, title, description, previousDepth, newDepth, gas, icon, descentRate, ascentRate);
  }

  createGasChangeSegment(startTime: number, newGas: BreathingGas, duration: number, depth: number) {
    const endTime = startTime + duration;
    const title = 'Switch Gas';
    const description = newGas.Description;

    return new DiveSegment(startTime, endTime, title, description, depth, depth, newGas, 'air', 0, 0);
  }

  getTravelTime(previousDepth: number, newDepth: number, descentRate: number, ascentRate: number): number {
    if (newDepth > previousDepth) {
      return Math.round((newDepth - previousDepth) * (60 / descentRate));
    } else {
      return Math.round((previousDepth - newDepth) * (60 / ascentRate));
    }
  }
}
