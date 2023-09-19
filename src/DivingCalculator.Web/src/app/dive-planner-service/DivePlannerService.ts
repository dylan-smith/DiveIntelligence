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

  setStartGas(gas: BreathingGas) {
    this.startGas = gas;
    this.diveSegments.push(this.diveSegmentFactory.createStartDiveSegment(gas));
    this.diveSegments.push(this.diveSegmentFactory.createEndDiveSegment(0));
  }

  getDiveSegments(): IDiveSegment[] {
    return this.diveSegments;
  }
}
