import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss']
})
export class NewDiveComponent {
  standardGases = [
    { name: 'Air', oxygen: 21, helium: 0, nitrogen: 79 },
    { name: 'Nitrox 32', oxygen: 32, helium: 0, nitrogen: 68 },
    { name: 'Oxygen', oxygen: 100, helium: 0, nitrogen: 0 },
    { name: 'Helitrox 25/25', oxygen: 25, helium: 25, nitrogen: 50 },
    { name: 'Helitrox 21/35', oxygen: 21, helium: 35, nitrogen: 44 },
    { name: 'Trimix 18/45', oxygen: 18, helium: 45, nitrogen: 37 },
    { name: 'Trimix 15/55', oxygen: 15, helium: 55, nitrogen: 30 },
    { name: 'Trimix 12/60', oxygen: 12, helium: 60, nitrogen: 28 },
    { name: 'Trimix 10/70', oxygen: 10, helium: 70, nitrogen: 20 },
    { name: 'Nitrox 50', oxygen: 50, helium: 0, nitrogen: 50 },
    { name: 'Helitrox 35/25', oxygen: 35, helium: 25, nitrogen: 40 },
  ];

  selectedStandardGas = this.standardGases[0];
  gasType = 'standard';
  customGas = { name: 'Custom', oxygen: 21, helium: 0, nitrogen: 79 };

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
    this.customGas.nitrogen = 100 - this.customGas.oxygen - this.customGas.helium;
  }

  onStandardGasChange(event : MatSelectionListChange) {
    this.selectedStandardGas = event.options[0].value;
  }

  getGasTooltip(gas : any) : string {
    return `Max Depth (PO2): ${this.getMaxPO2Depth(gas)}m (${this.getMaxPO2DecoDepth(gas)}m deco)\nMax Depth (END): ${this.getMaxENDDepth(gas)}m\nMin Depth (Hypoxia): ${this.getMinDepth(gas)}m`;
  }

  getMaxPO2Depth(gas : any) : number {
    return Math.floor(1400 / gas.oxygen - 10);
  }

  getMaxPO2DecoDepth(gas : any) : number {
    return Math.floor(1600 / gas.oxygen - 10);
  }

  getMaxENDDepth(gas : any) : number {
    return Math.floor(3950 / gas.nitrogen - 10);
  }

  getMinDepth(gas : any) : number {
    return Math.max(0, Math.ceil(180 / gas.oxygen - 10));
  }
}
