import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-dive-settings',
  templateUrl: './dive-settings.component.html',
  styleUrl: './dive-settings.component.scss',
})
export class DiveSettingsComponent {
  ascentRate = this.divePlanner.settings.ascentRate;
  descentRate = this.divePlanner.settings.descentRate;
  isOxygenNarcotic = this.divePlanner.settings.isOxygenNarcotic;
  workingPO2Maximum = this.divePlanner.settings.workingPO2Maximum;
  decoPO2Maximum = this.divePlanner.settings.decoPO2Maximum;
  pO2Minimum = this.divePlanner.settings.pO2Minimum;
  ENDErrorThreshold = this.divePlanner.settings.ENDErrorThreshold;
  GFLow = this.divePlanner.settings.GFLow;
  GFHigh = this.divePlanner.settings.GFHigh;

  constructor(public divePlanner: DivePlannerService) {}

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

  onGFLowInput(): void {
    this.divePlanner.settings.GFLow = this.GFLow;
  }

  onGFHighInput(): void {
    this.divePlanner.settings.GFHigh = this.GFHigh;
  }
}
