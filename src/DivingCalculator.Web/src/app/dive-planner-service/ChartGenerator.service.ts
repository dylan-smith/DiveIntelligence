import { Injectable } from '@angular/core';
import { DiveProfile } from './DiveProfile';
import { BreathingGas } from './BreathingGas';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';

@Injectable({
  providedIn: 'root',
})
export class ChartGeneratorService {
  constructor(private diveSegmentFactory: DiveSegmentFactoryService) {}

  getDepthChartData(diveProfile: DiveProfile): { time: number; depth: number; ceiling: number }[] {
    let data: { time: number; depth: number; ceiling: number }[] = [];

    for (const segment of diveProfile.segments) {
      data = [...data, ...segment.getDepthChartData()];
    }

    for (const d of data) {
      d.ceiling = diveProfile.algo.getCeiling(d.time);
    }

    return data;
  }

  getPO2ChartData(diveProfile: DiveProfile): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    let data: { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] = [];

    for (const segment of diveProfile.segments) {
      data = [...data, ...segment.getPO2ChartData()];
    }

    return data;
  }

  getENDChartData(diveProfile: DiveProfile): { time: number; end: number; errorLimit: number }[] {
    let data: { time: number; end: number; errorLimit: number }[] = [];

    for (const segment of diveProfile.segments) {
      data = [...data, ...segment.getENDChartData()];
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
      for (const d of segment.getDepthChartData()) {
        const ceilings: number[] = [];
        for (let i = 1; i <= 16; i++) {
          ceilings.push(diveProfile.algo.getTissueCeiling(d.time, i));
        }

        data.push({
          time: d.time,
          depth: d.depth,
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

    for (let t = 0; t <= diveProfile.getTotalTime(); t++) {
      const tissuesPN2: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPN2.push(diveProfile.algo.getTissuePN2(t, i));
      }

      data.push({
        time: t,
        gasPN2: diveProfile.getPN2(t),
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

    for (let t = 0; t <= diveProfile.getTotalTime(); t++) {
      const tissuesPHe: number[] = [];
      for (let i = 1; i <= 16; i++) {
        tissuesPHe.push(diveProfile.algo.getTissuePHe(t, i));
      }

      data.push({
        time: t,
        gasPHe: diveProfile.getPHe(t),
        tissuesPHe,
      });
    }

    return data;
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas, diveProfile: DiveProfile): { time: number; ceiling: number }[] {
    const data: { time: number; ceiling: number }[] = [];

    const wipProfile = diveProfile.getCurrentProfile();

    wipProfile.addSegment(
      this.diveSegmentFactory.createDepthChangeSegment(
        wipProfile.getLastSegment().EndTimestamp,
        wipProfile.getLastSegment().EndDepth,
        newDepth,
        0,
        diveProfile.getCurrentGas()
      )
    );

    const startTime = wipProfile.getTotalTime();
    const chartDuration = 3600 * 2;

    wipProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(wipProfile.getLastSegment().EndTimestamp, newGas, chartDuration, newDepth));

    for (let t = startTime; t < startTime + chartDuration; t++) {
      data.push({ time: t - startTime, ceiling: wipProfile.algo.getCeiling(t) });
    }

    return data;
  }
}
