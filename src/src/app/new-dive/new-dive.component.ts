import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { StandardGasListComponent } from '../standard-gas-list/standard-gas-list.component';
import { CustomGasInputComponent } from '../custom-gas-input/custom-gas-input.component';
import { DiveSettingsComponent } from '../dive-settings/dive-settings.component';
import { StartGasStatsComponent } from '../start-gas-stats/start-gas-stats.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss'],
  imports: [
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    StandardGasListComponent,
    CustomGasInputComponent,
    DiveSettingsComponent,
    StartGasStatsComponent,
    MatButton,
  ],
})
export class NewDiveComponent {
  private router = inject(Router);
  divePlanner = inject(DivePlannerService);

  selectedStandardGas: BreathingGas = BreathingGas.StandardGases[0];
  gasType = 'standard';
  customGas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);

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
