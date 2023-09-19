import { Injectable } from '@angular/core';
import { StandardGases } from './StandardGases';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  startGas: BreathingGas | undefined;
  diveSegments: DiveSegment[] = [];

  constructor(private diveSegmentFactory: DiveSegmentFactoryService) {}

  getStandardGases(): BreathingGas[] {
    return StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.startGas = startGas;

    this.diveSegments = [];
    this.diveSegments.push(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.diveSegments.push(this.diveSegmentFactory.createEndDiveSegment(0));
  }

  getDiveSegments(): DiveSegment[] {
    return this.diveSegments;
  }

  getDiveDuration(): number {
    return this.diveSegments[this.diveSegments.length - 1].EndTimestamp;
  }

  getMaxDepth(): number {
    return Math.max(...this.diveSegments.map(x => x.EndDepth));
  }

  getAverageDepth(): number {
    if (this.getMaxDepth() === 0) {
      return 0;
    }

    return this.diveSegments.map(x => x.getAverageDepth() * x.getDuration()).reduce((sum, current) => sum + current, 0) / this.getDiveDuration();
  }
}
