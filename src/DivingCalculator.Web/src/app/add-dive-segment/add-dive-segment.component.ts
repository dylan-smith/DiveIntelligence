import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { Router } from '@angular/router';

@Component({
  selector: 'dive-add-dive-segment',
  templateUrl: './add-dive-segment.component.html',
  styleUrls: ['./add-dive-segment.component.scss'],
})
export class AddDiveSegmentComponent {
  newDepth: number;
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  newGasSelectedOption: string;
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = new BreathingGas('Custom', 21, 0, 79);
  timeAtDepth = 0;

  constructor(
    public divePlanner: DivePlannerService,
    private router: Router
  ) {
    this.newDepth = divePlanner.getCurrentDepth();
    this.newGasSelectedOption = 'current';
  }

  calculateNewGas(): void {
    // default it to current gas (e.g. standard is selected but no option picked in dropdown)
    this.newGas = this.divePlanner.getCurrentGas();

    if (this.newGasSelectedOption === 'standard' && this.standardGas !== undefined) {
      this.newGas = this.standardGas;
    }

    if (this.newGasSelectedOption === 'custom') {
      this.newGas = this.customGas;
    }
  }

  getStandardGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'standard';
  }

  getCustomGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'custom';
  }

  updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
    this.calculateNewGas();
  }

  onSave(): void {
    this.divePlanner.addDiveSegment(this.newDepth, this.newGas, this.timeAtDepth * 60);
    this.router.navigate(['/dive-plan']);
  }

  getCurrentPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.divePlanner.getCurrentDepth());
  }

  isCurrentPO2Warning(): boolean {
    return this.getCurrentPO2() > 1.4 && this.getCurrentPO2() <= 1.6;
  }

  isCurrentPO2Error(): boolean {
    return this.getCurrentPO2() > 1.6;
  }

  getCurrentEND(): number {
    return this.divePlanner.getCurrentGas().getEND(this.divePlanner.getCurrentDepth());
  }

  isCurrentENDWarning(): boolean {
    return this.getCurrentEND() > 30 && this.getCurrentEND() <= 40;
  }

  isCurrentENDError(): boolean {
    return this.getCurrentEND() > 40;
  }

  getNewDepthPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  isNewDepthPO2Warning(): boolean {
    return this.getNewDepthPO2() > 1.4 && this.getNewDepthPO2() <= 1.6;
  }

  isNewDepthPO2Error(): boolean {
    return this.getNewDepthPO2() > 1.6;
  }

  getNewDepthEND(): number {
    return this.divePlanner.getCurrentGas().getEND(this.newDepth);
  }

  isNewDepthENDWarning(): boolean {
    return this.getNewDepthEND() > 30 && this.getNewDepthEND() <= 40;
  }

  isNewDepthENDError(): boolean {
    return this.getNewDepthEND() > 40;
  }

  getDescentDuration(): number | undefined {
    return this.divePlanner.getDescentDuration(this.newDepth);
  }

  getAscentDuration(): number | undefined {
    return this.divePlanner.getAscentDuration(this.newDepth);
  }
}
