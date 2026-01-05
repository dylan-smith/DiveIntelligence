import { Component, EventEmitter, Output, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField } from '@angular/material/input';
import { MatSelect, MatSelectTrigger, MatOption } from '@angular/material/select';
import { CustomGasInputComponent } from '../custom-gas-input/custom-gas-input.component';

@Component({
  selector: 'dive-new-gas-input',
  templateUrl: './new-gas-input.component.html',
  styleUrl: './new-gas-input.component.scss',
  imports: [MatRadioGroup, FormsModule, MatRadioButton, MatTooltip, MatFormField, MatSelect, MatSelectTrigger, MatOption, CustomGasInputComponent],
})
export class NewGasInputComponent {
  divePlanner = inject(DivePlannerService);

  @Output() newGasSelected = new EventEmitter<BreathingGas>();

  newGasSelectedOption = 'current';
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  StandardGases: BreathingGas[] = BreathingGas.StandardGases;
  optimalGas: BreathingGas = this.divePlanner.getOptimalDecoGas(this.divePlanner.getCurrentDepth());
  isStandardGasDisabled: boolean = this.getStandardGasDisabled();
  isCustomGasDisabled: boolean = this.getCustomGasDisabled();

  onGasTypeChange(): void {
    this.calculateNewGas();

    this.isStandardGasDisabled = this.getStandardGasDisabled();
    this.isCustomGasDisabled = this.getCustomGasDisabled();

    this.newGasSelected.emit(this.newGas);
  }

  onStandardGasSelectionChange(): void {
    this.calculateNewGas();
    this.newGasSelected.emit(this.newGas);
  }

  onCustomGasChanged(gas: BreathingGas): void {
    this.customGas = gas;
    this.calculateNewGas();
    this.newGasSelected.emit(this.newGas);
  }

  private calculateNewGas(): void {
    // default it to current gas (e.g. standard is selected but no option picked in dropdown)
    this.newGas = this.divePlanner.getCurrentGas();

    if (this.newGasSelectedOption === 'standard' && this.standardGas !== undefined) {
      this.newGas = this.standardGas;
    }

    if (this.newGasSelectedOption === 'custom') {
      this.newGas = this.customGas;
    }

    if (this.newGasSelectedOption === 'optimal') {
      this.newGas = this.optimalGas;
    }
  }

  private getStandardGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'standard';
  }

  private getCustomGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'custom';
  }
}
