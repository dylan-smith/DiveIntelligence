import { Component } from '@angular/core';

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

  selectStandardGas(gas : any) {
    this.selectedStandardGas = gas;
  }

  isStandardGasSelected() : boolean {
    return false;
  }

  isCustomGasSelected() : boolean {
    return true;
  }

  getGasTooltip(gas : any) : string {
    var maxDepthOxygen = 1400 / gas.oxygen - 10;
    var maxDepthOxygenDeco = 1600 / gas.oxygen - 10;
    var maxDepthEND = 3950 / gas.nitrogen - 10;

    return `Max Depth (PO2): ${Math.floor(maxDepthOxygen)}m (${Math.floor(maxDepthOxygenDeco)}m deco)\nMax Depth (END): ${Math.floor(maxDepthEND)}m`;
  }
}
