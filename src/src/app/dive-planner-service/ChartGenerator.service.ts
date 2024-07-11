import { Injectable } from '@angular/core';
import { DiveProfile } from './DiveProfile';
import { BreathingGas } from './BreathingGas';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveSettingsService } from './DiveSettings.service';

@Injectable({
  providedIn: 'root',
})
export class ChartGeneratorService {
  constructor(
    private diveSegmentFactory: DiveSegmentFactoryService,
    private diveSettings: DiveSettingsService
  ) {}

  getDepthChartData(diveProfile: DiveProfile): { time: number; depth: number; ceiling: number }[] {
    const data: { time: number; depth: number; ceiling: number }[] = [];

    for (const segment of diveProfile.segments) {
      for (let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++) {
        data.push({ time: time, depth: segment.getDepth(time), ceiling: 0 });
      }
    }

    for (const d of data) {
      d.ceiling = diveProfile.algo.getInstantCeiling(d.time, d.depth);
    }

    return data;
  }

  getPO2ChartData(diveProfile: DiveProfile): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    const data: { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] = [];

    for (const segment of diveProfile.segments) {
      for (let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++) {
        data.push({
          time: time,
          pO2: segment.Gas.getPO2(segment.getDepth(time)),
          decoLimit: this.diveSettings.decoPO2Maximum,
          limit: this.diveSettings.workingPO2Maximum,
          min: this.diveSettings.pO2Minimum,
        });
      }
    }

    return data;
  }

  getENDChartData(diveProfile: DiveProfile): { time: number; end: number; errorLimit: number }[] {
    const data: { time: number; end: number; errorLimit: number }[] = [];

    for (const segment of diveProfile.segments) {
      for (let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++) {
        data.push({
          time: time,
          end: segment.Gas.getEND(segment.getDepth(time)),
          errorLimit: this.diveSettings.ENDErrorThreshold,
        });
      }
    }

    return data;
  }

  getTissuesCeilingChartData(diveProfile: DiveProfile): { time: number; depth: number; tissuesCeiling: number[] }[] {
    const data: {
      time: number;
      depth: number;
      tissuesCeiling: number[];
    }[] = [];

    for (const segment of diveProfile.segments) {
      for (let time = segment.StartTimestamp; time <= segment.EndTimestamp; time++) {
        const ceilings: number[] = [];
        const depth = segment.getDepth(time);

        for (let tissue = 1; tissue <= 16; tissue++) {
          ceilings.push(diveProfile.algo.getTissueInstantCeiling(time, tissue, depth));
        }

        data.push({
          time: time,
          depth: depth,
          tissuesCeiling: ceilings,
        });
      }
    }

    return data;
  }

  getTissuesPN2ChartData(diveProfile: DiveProfile): { time: number; gasPN2: number; tissuesPN2: number[] }[] {
    const data: {
      time: number;
      gasPN2: number;
      tissuesPN2: number[];
    }[] = [];

    for (let time = 0; time <= diveProfile.getTotalTime(); time++) {
      const tissuesPN2: number[] = [];
      for (let tissue = 1; tissue <= 16; tissue++) {
        tissuesPN2.push(diveProfile.algo.getTissuePN2(time, tissue));
      }

      data.push({
        time: time,
        gasPN2: diveProfile.getPN2(time),
        tissuesPN2,
      });
    }

    return data;
  }

  getTissuesPHeChartData(diveProfile: DiveProfile): { time: number; gasPHe: number; tissuesPHe: number[] }[] {
    const data: {
      time: number;
      gasPHe: number;
      tissuesPHe: number[];
    }[] = [];

    for (let time = 0; time <= diveProfile.getTotalTime(); time++) {
      const tissuesPHe: number[] = [];
      for (let tissue = 1; tissue <= 16; tissue++) {
        tissuesPHe.push(diveProfile.algo.getTissuePHe(time, tissue));
      }

      data.push({
        time: time,
        gasPHe: diveProfile.getPHe(time),
        tissuesPHe,
      });
    }

    return data;
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas, diveProfile: DiveProfile): { time: number; ceiling: number }[] {
    const data: { time: number; ceiling: number }[] = [];

    const wipProfile = diveProfile.getCurrentProfile();

    wipProfile.addSegment(
      this.diveSegmentFactory.createDepthChangeSegment(wipProfile.getTotalTime(), diveProfile.getCurrentDepth(), newDepth, diveProfile.getCurrentGas())
    );

    const startTime = wipProfile.getTotalTime();
    const chartDuration = 3600 * 2; // 2 hours

    wipProfile.addSegment(this.diveSegmentFactory.createMaintainDepthSegment(wipProfile.getTotalTime(), newDepth, chartDuration, newGas));

    for (let time = startTime; time < startTime + chartDuration; time++) {
      data.push({ time: time - startTime, ceiling: wipProfile.algo.getInstantCeiling(time, wipProfile.getDepth(time)) });
    }

    return data;
  }
}
