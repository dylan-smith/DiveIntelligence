import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { ceilingWithThreshold } from '../utility/utility';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';

@Component({
    selector: 'dive-current-stats',
    templateUrl: './current-stats.component.html',
    styleUrl: './current-stats.component.scss',
    standalone: false
})
export class CurrentStatsComponent {
  currentDepth: number = this.divePlanner.getCurrentDepth();
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();
  noDecoLimit: string = this.getNoDecoLimit();
  currentCeiling: number = this.divePlanner.getCurrentCeiling();
  instantCeiling: number = this.divePlanner.getCurrentInstantCeiling();
  currentPO2: number = this.getPO2();
  hasCurrentPO2Warning: boolean = this.getPO2WarningMessage() !== undefined;
  hasCurrentPO2Error: boolean = this.getPO2ErrorMessage() !== undefined;
  currentPO2Warning: string | undefined = this.getPO2WarningMessage();
  currentPO2Error: string | undefined = this.getPO2ErrorMessage();
  currentEND: number = this.getEND();
  hasCurrentENDError: boolean = this.getENDErrorMessage() !== undefined;
  currentENDError: string | undefined = this.getENDErrorMessage();

  constructor(
    public divePlanner: DivePlannerService,
    private humanDurationPipe: HumanDurationPipe
  ) {}

  private getPO2(): number {
    return this.currentGas.getPO2(this.currentDepth);
  }

  private getPO2WarningMessage(): string | undefined {
    return this.divePlanner.getPO2WarningMessage(this.getPO2());
  }

  private getPO2ErrorMessage(): string | undefined {
    return this.divePlanner.getPO2ErrorMessage(this.getPO2());
  }

  private getEND(): number {
    return ceilingWithThreshold(this.currentGas.getEND(this.currentDepth));
  }

  private getENDErrorMessage(): string | undefined {
    return this.divePlanner.getENDErrorMessage(this.getEND());
  }

  private getNoDecoLimit(): string {
    const ndl = this.divePlanner.getNoDecoLimit(this.currentDepth, this.currentGas, 0);

    if (ndl === undefined) {
      return '> 5 hours';
    }

    return this.humanDurationPipe.transform(ndl);
  }
}
