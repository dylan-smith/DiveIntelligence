import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { Router } from '@angular/router';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';

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
    private router: Router,
    private humanDurationPipe: HumanDurationPipe
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

    if (this.newGasSelectedOption === 'optimal') {
      this.newGas = this.divePlanner.getOptimalDecoGas(this.newDepth);
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

  getPO2Warning(pO2: number): string | undefined {
    if (pO2 > 1.4 && pO2 <= 1.6) return 'Oxygen partial pressure should only go above 1.4 during deco stops';
    return undefined;
  }

  getPO2Error(pO2: number): string | undefined {
    if (pO2 > 1.6) return 'Oxygen partial pressure should never go above 1.6';
    if (pO2 < 0.18) return 'Oxygen partial pressure should never go below 0.18';
    return undefined;
  }

  getENDWarning(END: number): string | undefined {
    if (END > 30 && END <= 40) return 'Some divers (e.g. GUE) aim to keep END below 30m';
    return undefined;
  }

  getENDError(END: number): string | undefined {
    if (END > 40) return 'Most divers aim to keep END below 40m';
    return undefined;
  }

  getCurrentPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.divePlanner.getCurrentDepth());
  }

  getCurrentPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getCurrentPO2());
  }

  getCurrentPO2Error(): string | undefined {
    return this.getPO2Error(this.getCurrentPO2());
  }

  getCurrentEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.divePlanner.getCurrentDepth()));
  }

  getCurrentENDWarning(): string | undefined {
    return this.getENDWarning(this.getCurrentEND());
  }

  getCurrentENDError(): string | undefined {
    return this.getENDError(this.getCurrentEND());
  }

  getNewDepthPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  getNewDepthPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewDepthPO2());
  }

  getNewDepthPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewDepthPO2());
  }

  getNewDepthEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.newDepth));
  }

  getNewDepthENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewDepthEND());
  }

  getNewDepthENDError(): string | undefined {
    return this.getENDError(this.getNewDepthEND());
  }

  getDescentDuration(): number | undefined {
    return this.divePlanner.getDescentDuration(this.newDepth);
  }

  getAscentDuration(): number | undefined {
    return this.divePlanner.getAscentDuration(this.newDepth);
  }

  getNewGasPO2(): number {
    return this.newGas.getPO2(this.newDepth);
  }

  getNewGasPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewGasPO2());
  }

  getNewGasPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewGasPO2());
  }

  getNewGasEND(): number {
    return Math.ceil(this.newGas.getEND(this.newDepth));
  }

  getNewGasENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewGasEND());
  }

  getNewGasENDError(): string | undefined {
    return this.getENDError(this.getNewGasEND());
  }

  getNoDecoLimit(): string {
    const ndl = this.divePlanner.getNoDecoLimit(this.newDepth, this.newGas);

    if (ndl === undefined) {
      return '> 5 hours';
    }

    return this.humanDurationPipe.transform(ndl);
  }
}
