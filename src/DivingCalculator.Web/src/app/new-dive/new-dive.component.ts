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
    return this.getSelectedGas().getMinDepth() > 0;
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
    return `Max Depth (PO2): ${gas.getMaxDepthPO2()}m (${gas.getMaxDepthPO2Deco()}m deco)\nMax Depth (END): ${gas.getMaxDepthEND()}m\nMin Depth (Hypoxia): ${gas.getMinDepth()}m`;
  }

  onSave() {
    this.divePlanner.startDive(this.getSelectedGas());
    this.router.navigate(['/dive-plan']);
  }
}
