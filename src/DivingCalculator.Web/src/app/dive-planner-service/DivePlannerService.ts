import { Injectable } from '@angular/core';
import { StandardGases } from './StandardGases';
import { BreathingGas } from './BreathingGas';
import { IDiveSegment } from './IDiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  startGas: BreathingGas | undefined;
  diveSegments: IDiveSegment[] = [];

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

  getDiveSegments(): IDiveSegment[] {
    return this.diveSegments;
  }
}
