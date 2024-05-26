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
  ascentRate = this.divePlanner.settings.ascentRate;
  descentRate = this.divePlanner.settings.descentRate;
  isOxygenNarcotic = this.divePlanner.settings.isOxygenNarcotic;
  workingPO2Maximum = this.divePlanner.settings.workingPO2Maximum;
  decoPO2Maximum = this.divePlanner.settings.decoPO2Maximum;
  pO2Minimum = this.divePlanner.settings.pO2Minimum;
  ENDErrorThreshold = this.divePlanner.settings.ENDErrorThreshold;

  isMinDepthError(): boolean {
    return this.getSelectedGas().minDepth > 0;
  }

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

  onDescentRateInput(): void {
    this.divePlanner.settings.descentRate = this.descentRate;
  }

  onAscentRateInput(): void {
    this.divePlanner.settings.ascentRate = this.ascentRate;
  }

  onOxygenNarcoticChange(): void {
    this.divePlanner.settings.isOxygenNarcotic = this.isOxygenNarcotic;
  }

  onWorkingPO2MaximumInput(): void {
    this.divePlanner.settings.workingPO2Maximum = this.workingPO2Maximum;
  }

  onDecoPO2MaximumInput(): void {
    this.divePlanner.settings.decoPO2Maximum = this.decoPO2Maximum;
  }

  onPO2MinimumInput(): void {
    this.divePlanner.settings.pO2Minimum = this.pO2Minimum;
  }

  onENDErrorThresholdInput(): void {
    this.divePlanner.settings.ENDErrorThreshold = this.ENDErrorThreshold;
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
