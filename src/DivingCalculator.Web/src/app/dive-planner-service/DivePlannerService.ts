import { Injectable } from '@angular/core';
import { StandardGases } from './StandardGases';
import { BreathingGas } from './BreathingGas';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  startGas: BreathingGas | undefined;

  getStandardGases(): BreathingGas[] {
    return StandardGases;
  }

  setStartGas(gas: BreathingGas) {
    this.startGas = gas;
  }
}
