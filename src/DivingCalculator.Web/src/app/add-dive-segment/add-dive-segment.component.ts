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
  descentTime: number | undefined;
  ascentTime: number | undefined;
  newDepthPO2!: number;
  newDepthEND!: number;
  newGas!: BreathingGas;
  newGasSelectedOption: string;
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = new BreathingGas('Custom', 21, 0, 79);
  timeAtDepth = 0;

  private DESCENT_RATE = 3; // seconds per meter
  private ASCENT_RATE = 6; // seconds per meter

  constructor(
    public divePlanner: DivePlannerService,
    private router: Router
  ) {
    this.newDepth = divePlanner.getCurrentDepth();
    this.calculateNewDepthData();
    this.newGasSelectedOption = 'current';
    this.calculateNewGas();
  }

  calculateNewDepthData(): void {
    this.descentTime = undefined;
    this.ascentTime = undefined;

    if (this.newDepth > this.divePlanner.getCurrentDepth()) {
      this.descentTime = (this.newDepth - this.divePlanner.getCurrentDepth()) * this.DESCENT_RATE;
    }

    if (this.newDepth < this.divePlanner.getCurrentDepth()) {
      this.ascentTime = (this.divePlanner.getCurrentDepth() - this.newDepth) * this.ASCENT_RATE;
    }

    this.newDepthPO2 = this.divePlanner.getCurrentGas().getPO2(this.newDepth);
    this.newDepthEND = this.divePlanner.getCurrentGas().getEND(this.newDepth);
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
}
