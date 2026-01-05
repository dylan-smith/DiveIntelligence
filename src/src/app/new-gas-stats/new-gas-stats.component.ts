import { Component, Input, OnChanges } from '@angular/core';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { ceilingWithThreshold } from '../utility/utility';

@Component({
  selector: 'dive-new-gas-stats',
  templateUrl: './new-gas-stats.component.html',
  styleUrl: './new-gas-stats.component.scss',
  standalone: false,
})
export class NewGasStatsComponent implements OnChanges {
  @Input() newGas: BreathingGas = this.divePlanner.getCurrentGas();

  currentDepth: number = this.divePlanner.getCurrentDepth();
  newGasPO2: number = this.getNewGasPO2();
  hasNewGasPO2Warning: boolean = this.getNewGasPO2WarningMessage() !== undefined;
  hasNewGasPO2Error: boolean = this.getNewGasPO2ErrorMessage() !== undefined;
  newGasPO2Warning: string | undefined = this.getNewGasPO2WarningMessage();
  newGasPO2Error: string | undefined = this.getNewGasPO2ErrorMessage();
  newGasEND: number = this.getNewGasEND();
  hasNewGasENDError: boolean = this.getNewGasENDErrorMessage() !== undefined;
  newGasENDError: string | undefined = this.getNewGasENDErrorMessage();
  noDecoLimit: string = this.getNoDecoLimit();

  constructor(
    public divePlanner: DivePlannerService,
    private humanDurationPipe: HumanDurationPipe
  ) {}

  ngOnChanges(): void {
    this.calculateNewGasStats();
  }

  private calculateNewGasStats(): void {
    this.newGasPO2 = this.getNewGasPO2();
    this.hasNewGasPO2Warning = this.getNewGasPO2WarningMessage() !== undefined;
    this.hasNewGasPO2Error = this.getNewGasPO2ErrorMessage() !== undefined;
    this.newGasPO2Warning = this.getNewGasPO2WarningMessage();
    this.newGasPO2Error = this.getNewGasPO2ErrorMessage();
    this.newGasEND = this.getNewGasEND();
    this.hasNewGasENDError = this.getNewGasENDErrorMessage() !== undefined;
    this.newGasENDError = this.getNewGasENDErrorMessage();
    this.noDecoLimit = this.getNoDecoLimit();
  }

  private getNewGasPO2(): number {
    return this.newGas.getPO2(this.currentDepth);
  }

  private getNewGasPO2WarningMessage(): string | undefined {
    return this.divePlanner.getPO2WarningMessage(this.getNewGasPO2());
  }

  private getNewGasPO2ErrorMessage(): string | undefined {
    return this.divePlanner.getPO2ErrorMessage(this.getNewGasPO2());
  }

  private getNewGasEND(): number {
    return ceilingWithThreshold(this.newGas.getEND(this.currentDepth));
  }

  private getNewGasENDErrorMessage(): string | undefined {
    return this.divePlanner.getENDErrorMessage(this.getNewGasEND());
  }

  private getNoDecoLimit(): string {
    const ndl = this.divePlanner.getNoDecoLimit(this.currentDepth, this.newGas, 0);

    if (ndl === undefined) {
      return '> 5 hours';
    }

    return this.humanDurationPipe.transform(ndl);
  }
}
