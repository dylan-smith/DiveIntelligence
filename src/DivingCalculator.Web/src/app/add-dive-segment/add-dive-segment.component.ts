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

  getCurrentPO2Warning(): string | undefined {
    if (this.getCurrentPO2() > 1.4 && this.getCurrentPO2() <= 1.6) return 'Oxygen partial pressure should only go above 1.4 during deco stops';
    return undefined;
  }

  getCurrentPO2Error(): string | undefined {
    if (this.getCurrentPO2() > 1.6) return 'Oxygen partial pressure should never go above 1.6';
    if (this.getCurrentPO2() < 0.18) return 'Oxygen partial pressure should never go below 0.18';
    return undefined;
  }

  getCurrentEND(): number {
    return this.divePlanner.getCurrentGas().getEND(this.divePlanner.getCurrentDepth());
  }

  getCurrentENDWarning(): string | undefined {
    if (this.getCurrentEND() > 30 && this.getCurrentEND() <= 40) return 'Some divers (e.g. GUE) aim to keep END below 30m';
    return undefined;
  }

  getCurrentENDError(): string | undefined {
    if (this.getCurrentEND() > 40) return 'Most divers aim to keep END below 40m';
    return undefined;
  }

  getNewDepthPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  getNewDepthPO2Warning(): string | undefined {
    if (this.getNewDepthPO2() > 1.4 && this.getNewDepthPO2() <= 1.6) return 'Oxygen partial pressure should only go above 1.4 during deco stops';
    return undefined;
  }

  getNewDepthPO2Error(): string | undefined {
    if (this.getNewDepthPO2() > 1.6) return 'Oxygen partial pressure should never go above 1.6';
    if (this.getNewDepthPO2() < 0.18) return 'Oxygen partial pressure should never go below 0.18';
    return undefined;
  }

  getNewDepthEND(): number {
    return this.divePlanner.getCurrentGas().getEND(this.newDepth);
  }

  getNewDepthENDWarning(): string | undefined {
    if (this.getNewDepthEND() > 30 && this.getNewDepthEND() <= 40) return 'Some divers (e.g. GUE) aim to keep END below 30m';
    return undefined;
  }

  getNewDepthENDError(): string | undefined {
    if (this.getNewDepthEND() > 40) return 'Most divers aim to keep END below 40m';
    return undefined;
  }

  getDescentDuration(): number | undefined {
    return this.divePlanner.getDescentDuration(this.newDepth);
  }

  getAscentDuration(): number | undefined {
    return this.divePlanner.getAscentDuration(this.newDepth);
  }
}
