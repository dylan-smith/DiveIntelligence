import { Injectable } from '@angular/core';
import { StandardGases } from './StandardGases';
import { BreathingGas } from './BreathingGas';
import { IDiveSegment } from './IDiveSegment';
import { StartDiveSegment } from './StartDiveSegment';
import { EndDiveSegment } from './EndDiveSegment';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  startGas: BreathingGas | undefined;
  diveSegments: IDiveSegment[] = [];

  getStandardGases(): BreathingGas[] {
    return StandardGases;
  }

  setStartGas(gas: BreathingGas) {
    this.startGas = gas;
    this.diveSegments.push(new StartDiveSegment(gas));
    this.diveSegments.push(new EndDiveSegment(0));
  }

  getDiveSegments(): IDiveSegment[] {
    return this.diveSegments;
  }
}
