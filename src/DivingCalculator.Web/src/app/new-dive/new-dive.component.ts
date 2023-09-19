import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectionListChange } from '@angular/material/list';
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
    private divePlanner: DivePlannerService
  ) {}

  standardGases: BreathingGas[] = this.divePlanner.getStandardGases();
  selectedStandardGas: BreathingGas = this.standardGases[0];
  gasType = 'standard';
  customGas: BreathingGas = new BreathingGas('Custom', 21, 0, 79);

  isMinDepthError(): boolean {
    return this.getMinDepth(this.getSelectedGas()) > 0;
  }

  getSelectedGas() {
    if (this.gasType === 'standard') {
      return this.selectedStandardGas;
    } else {
      return this.customGas;
    }
  }

  getCustomGasDisabled() {
    return this.gasType === 'standard';
  }

  getStandardGasDisabled() {
    return this.gasType === 'custom';
  }

  updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
  }

  onStandardGasChange(event: MatSelectionListChange) {
    this.selectedStandardGas = event.options[0].value;
  }

  getGasTooltip(gas: BreathingGas): string {
    return `Max Depth (PO2): ${this.getMaxPO2Depth(gas)}m (${this.getMaxPO2DecoDepth(gas)}m deco)\nMax Depth (END): ${this.getMaxENDDepth(
      gas
    )}m\nMin Depth (Hypoxia): ${this.getMinDepth(gas)}m`;
  }

  getMaxPO2Depth(gas: BreathingGas): number {
    return Math.floor(1400 / gas.Oxygen - 10);
  }

  getMaxPO2DecoDepth(gas: BreathingGas): number {
    return Math.floor(1600 / gas.Oxygen - 10);
  }

  getMaxENDDepth(gas: BreathingGas): number {
    return Math.floor(3950 / gas.Nitrogen - 10);
  }

  getMinDepth(gas: BreathingGas): number {
    return Math.max(0, Math.ceil(180 / gas.Oxygen - 10));
  }

  onSave() {
    this.divePlanner.startDive(this.getSelectedGas());
    this.router.navigate(['/dive-plan']);
  }
}
