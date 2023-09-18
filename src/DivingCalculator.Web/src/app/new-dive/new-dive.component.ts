import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { BreathingGas } from '../BreathingGas';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss'],
})
export class NewDiveComponent {
  standardGases: BreathingGas[] = [
    new BreathingGas('Air', 21, 0, 79),
    new BreathingGas('Nitrox 32', 32, 0, 68),
    new BreathingGas('Oxygen', 100, 0, 0),
    new BreathingGas('Helitrox 25/25', 25, 25, 50),
    new BreathingGas('Helitrox 21/35', 21, 35, 44),
    new BreathingGas('Trimix 18/45', 18, 45, 37),
    new BreathingGas('Trimix 15/55', 15, 55, 30),
    new BreathingGas('Trimix 12/60', 12, 60, 28),
    new BreathingGas('Trimix 10/70', 10, 70, 20),
    new BreathingGas('Nitrox 50', 50, 0, 50),
    new BreathingGas('Helitrox 35/25', 35, 25, 40),
  ];

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
    this.customGas.Nitrogen =
      100 - this.customGas.Oxygen - this.customGas.Helium;
  }

  onStandardGasChange(event: MatSelectionListChange) {
    this.selectedStandardGas = event.options[0].value;
  }

  getGasTooltip(gas: BreathingGas): string {
    return `Max Depth (PO2): ${this.getMaxPO2Depth(
      gas
    )}m (${this.getMaxPO2DecoDepth(
      gas
    )}m deco)\nMax Depth (END): ${this.getMaxENDDepth(
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
}
