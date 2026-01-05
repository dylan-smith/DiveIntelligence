import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'dive-dive-settings',
  templateUrl: './dive-settings.component.html',
  styleUrl: './dive-settings.component.scss',
  imports: [MatIcon, MatFormField, MatTooltip, MatLabel, MatInput, FormsModule, MatSlideToggle],
})
export class DiveSettingsComponent {
  divePlanner = inject(DivePlannerService);

  ascentRate = this.divePlanner.settings.ascentRate;
  descentRate = this.divePlanner.settings.descentRate;
  isOxygenNarcotic = this.divePlanner.settings.isOxygenNarcotic;
  workingPO2Maximum = this.divePlanner.settings.workingPO2Maximum;
  decoPO2Maximum = this.divePlanner.settings.decoPO2Maximum;
  pO2Minimum = this.divePlanner.settings.pO2Minimum;
  ENDErrorThreshold = this.divePlanner.settings.ENDErrorThreshold;

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
}
