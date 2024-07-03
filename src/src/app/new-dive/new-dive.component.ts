import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss'],
})
export class NewDiveComponent {
  constructor(
    private router: Router,
    public divePlanner: DivePlannerService
  ) {}

  selectedStandardGas: BreathingGas = BreathingGas.StandardGases[0];
  gasType = 'standard';
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);

  getCustomGasDisabled() {
    return this.gasType === 'standard';
  }

  getStandardGasDisabled() {
    return this.gasType === 'custom';
  }

  onStandardGasSelected(gas: BreathingGas): void {
    this.selectedStandardGas = gas;
  }

  onCustomGasChanged(gas: BreathingGas): void {
    this.customGas = gas;
  }

  getSelectedGas() {
    if (this.gasType === 'standard') {
      return this.selectedStandardGas;
    } else {
      return this.customGas;
    }
  }

  onSave() {
    this.divePlanner.startDive(this.getSelectedGas());
    this.router.navigate(['/dive-overview']);
  }
}
