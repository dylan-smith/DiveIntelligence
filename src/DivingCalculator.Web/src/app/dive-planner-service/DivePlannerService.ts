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

  private DESCENT_RATE = 3; // seconds per meter
  private ASCENT_RATE = 6; // seconds per meter

  getStandardGases(): BreathingGas[] {
    return StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.startGas = startGas;

    this.diveSegments = [];
    this.diveSegments.push(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.diveSegments.push(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
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

  getCurrentDepth(): number {
    return this.diveSegments[this.diveSegments.length - 2].EndDepth;
  }

  getCurrentCeiling(): number {
    return 0;
  }

  getCurrentGas(): BreathingGas {
    return this.diveSegments[this.diveSegments.length - 2].Gas;
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number {
    return 632 + newDepth + newGas.Oxygen;
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    // remove the final surface segment, will re-add it later
    this.diveSegments.pop();

    let previousSegment = this.diveSegments[this.diveSegments.length - 1];
    let startTime = previousSegment.EndTimestamp;

    if (newDepth !== previousSegment.EndDepth) {
      if (previousSegment.Gas.isEquivalent(newGas)) {
        const newSegment = this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, timeAtDepth, previousSegment.Gas);
        this.diveSegments.push(newSegment);
      } else {
        const newSegment = this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, 0, previousSegment.Gas);
        this.diveSegments.push(newSegment);
      }
    }

    previousSegment = this.diveSegments[this.diveSegments.length - 1];
    startTime = previousSegment.EndTimestamp;

    if (!previousSegment.Gas.isEquivalent(newGas)) {
      const newSegment = this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, timeAtDepth, newDepth);
      this.diveSegments.push(newSegment);
    }

    const endTime = this.diveSegments[this.diveSegments.length - 1].EndTimestamp;

    this.diveSegments.push(this.diveSegmentFactory.createEndDiveSegment(endTime, newDepth, newGas));
  }

  getDescentDuration(newDepth: number): number | undefined {
    if (newDepth > this.getCurrentDepth()) {
      return (newDepth - this.getCurrentDepth()) * this.DESCENT_RATE;
    }

    return undefined;
  }

  getAscentDuration(newDepth: number): number | undefined {
    if (newDepth < this.getCurrentDepth()) {
      return (this.getCurrentDepth() - newDepth) * this.ASCENT_RATE;
    }

    return undefined;
  }
}
