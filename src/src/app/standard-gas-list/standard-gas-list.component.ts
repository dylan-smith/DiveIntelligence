import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'dive-standard-gas-list',
  templateUrl: './standard-gas-list.component.html',
  styleUrl: './standard-gas-list.component.scss',
})
export class StandardGasListComponent {
  @Input() disabled = false;
  @Output() gasSelected = new EventEmitter<BreathingGas>();

  standardGases: BreathingGas[] = BreathingGas.StandardGases;
  selectedGas: BreathingGas = this.standardGases[0];

  onGasChange(event: MatSelectionListChange): void {
    this.selectedGas = event.options[0].value;
    this.gasSelected.emit(this.selectedGas);
  }

  getGasTooltip(gas: BreathingGas): string {
    return `Max Depth (PO2): ${gas.maxDepthPO2}m (${gas.maxDepthPO2Deco}m deco)\nMax Depth (END): ${gas.maxDepthEND}m\nMin Depth (Hypoxia): ${gas.minDepth}m`;
  }
}
