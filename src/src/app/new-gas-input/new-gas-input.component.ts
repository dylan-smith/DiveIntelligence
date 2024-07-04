import { Component, EventEmitter, OnChanges, Output } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

@Component({
  selector: 'dive-new-gas-input',
  templateUrl: './new-gas-input.component.html',
  styleUrl: './new-gas-input.component.scss',
})
export class NewGasInputComponent implements OnChanges {
  @Output() newGasSelected = new EventEmitter<BreathingGas>();

  newGasSelectedOption = 'current';
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();
  currentDepth: number = this.divePlanner.getCurrentDepth();
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  StandardGases: BreathingGas[] = BreathingGas.StandardGases;
  optimalGas: BreathingGas = this.divePlanner.getOptimalDecoGas(this.currentDepth);
  isStandardGasDisabled: boolean = this.getStandardGasDisabled();
  isCustomGasDisabled: boolean = this.getCustomGasDisabled();

  constructor(public divePlanner: DivePlannerService) {}

  ngOnChanges(): void {
    this.optimalGas = this.divePlanner.getOptimalDecoGas(this.currentDepth);

    if (this.newGasSelectedOption === 'optimal') {
      this.newGas = this.optimalGas;
      this.newGasSelected.emit(this.newGas);
    }
  }

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
