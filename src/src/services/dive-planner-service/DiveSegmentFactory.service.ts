import { humanDuration } from '@/utils/format';
import { DiveSegment } from './DiveSegment';
import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';

export class DiveSegmentFactoryService {
  constructor(private settings: DiveSettingsService) {}

  createEndDiveSegment(startTime: number, depth: number, gas: BreathingGas): DiveSegment {
    const ascentTime = this.getTravelTime(depth, 0);
    const ascentTimeDuration = humanDuration(ascentTime);
    const endTime = startTime + ascentTime;

    return new DiveSegment(
      startTime,
      endTime,
      'Surface',
      `Ascent time: ${ascentTimeDuration} @ ${this.settings.ascentRate}m/min`,
      depth,
      0,
      gas,
      'done',
      this.settings
    );
  }

  createStartDiveSegment(gas: BreathingGas): DiveSegment {
    return new DiveSegment(0, 0, 'Start Dive', gas.description, 0, 0, gas, 'scuba_diving', this.settings);
  }

  createDepthChangeSegment(startTime: number, previousDepth: number, newDepth: number, gas: BreathingGas) {
    const travelTime = this.getTravelTime(previousDepth, newDepth);
    const endTime = startTime + travelTime;
    const title = newDepth > previousDepth ? `Descend to ${newDepth}m` : `Ascend to ${newDepth}m`;
    const description =
      newDepth > previousDepth
        ? `Descent time: ${humanDuration(travelTime)} @ ${this.settings.descentRate}m/min`
        : `Ascent time: ${humanDuration(travelTime)} @ ${this.settings.ascentRate}m/min`;
    const icon = newDepth > previousDepth ? 'arrow_downward' : 'arrow_upward';

    return new DiveSegment(startTime, endTime, title, description, previousDepth, newDepth, gas, icon, this.settings);
  }

  createGasChangeSegment(startTime: number, newGas: BreathingGas, depth: number) {
    const title = 'Switch Gas';
    const description = newGas.description;

    return new DiveSegment(startTime, startTime, title, description, depth, depth, newGas, 'air', this.settings);
  }

  createMaintainDepthSegment(startTime: number, depth: number, duration: number, gas: BreathingGas) {
    const endTime = startTime + duration;
    const title = `Maintain Depth at ${depth}m`;
    const description = `Time: ${humanDuration(duration)}`;
    const icon = 'arrow_forward';

    return new DiveSegment(startTime, endTime, title, description, depth, depth, gas, icon, this.settings);
  }

  getTravelTime(previousDepth: number, newDepth: number): number {
    if (newDepth > previousDepth) {
      return Math.round((newDepth - previousDepth) * (60 / this.settings.descentRate));
    } else {
      return Math.round((previousDepth - newDepth) * (60 / this.settings.ascentRate));
    }
  }
}
