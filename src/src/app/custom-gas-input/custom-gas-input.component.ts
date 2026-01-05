import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'dive-custom-gas-input',
  templateUrl: './custom-gas-input.component.html',
  styleUrl: './custom-gas-input.component.scss',
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatTooltip],
})
export class CustomGasInputComponent {
  private divePlanner = inject(DivePlannerService);

  @Input() disabled: boolean = false;
  @Output() gasChanged = new EventEmitter<BreathingGas>();
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);

  onOxygenInput(): void {
    this.updateCustomGasNitrogen();
    this.gasChanged.emit(this.customGas);
  }

  onHeliumInput(): void {
    this.updateCustomGasNitrogen();
    this.gasChanged.emit(this.customGas);
  }

  private updateCustomGasNitrogen() {
    this.customGas.nitrogen = 100 - this.customGas.oxygen - this.customGas.helium;
    this.customGas = BreathingGas.create(this.customGas.oxygen, this.customGas.helium, this.customGas.nitrogen, this.divePlanner.settings);
  }
}
