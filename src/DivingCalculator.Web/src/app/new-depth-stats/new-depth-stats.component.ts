import { Component, Input, OnChanges } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { ceilingWithThreshold } from '../utility/utility';

@Component({
  selector: 'dive-new-depth-stats',
  templateUrl: './new-depth-stats.component.html',
  styleUrl: './new-depth-stats.component.scss',
})
export class NewDepthStatsComponent implements OnChanges {
  @Input() newDepth: number = 0;

  travelTime: number = this.divePlanner.getTravelTime(this.newDepth);
  descentRate: number = this.divePlanner.settings.descentRate;
  ascentRate: number = this.divePlanner.settings.ascentRate;
  isDescent: boolean = this.isNewDepthDescent();
  isAscent = !this.isNewDepthDescent();
  PO2: number = this.getPO2();
  hasPO2Warning: boolean = this.getPO2WarningMessage() !== undefined;
  hasPO2Error: boolean = this.getPO2ErrorMessage() !== undefined;
  PO2WarningMessage: string | undefined = this.getPO2WarningMessage();
  PO2ErrorMessage: string | undefined = this.getPO2ErrorMessage();
  END: number = this.getEND();
  hasENDError: boolean = this.getENDErrorMessage() !== undefined;
  ENDErrorMessage: string | undefined = this.getENDErrorMessage();

  constructor(public divePlanner: DivePlannerService) {}

  ngOnChanges(): void {
    this.calculateNewDepthStats();
  }

  private calculateNewDepthStats(): void {
    this.travelTime = this.divePlanner.getTravelTime(this.newDepth);
    this.isDescent = this.isNewDepthDescent();
    this.isAscent = !this.isNewDepthDescent();
    this.PO2 = this.getPO2();
    this.hasPO2Warning = this.getPO2WarningMessage() !== undefined;
    this.hasPO2Error = this.getPO2ErrorMessage() !== undefined;
    this.PO2WarningMessage = this.getPO2WarningMessage();
    this.PO2ErrorMessage = this.getPO2ErrorMessage();
    this.END = this.getEND();
    this.hasENDError = this.getENDErrorMessage() !== undefined;
    this.ENDErrorMessage = this.getENDErrorMessage();
  }

  private isNewDepthDescent(): boolean {
    return this.newDepth >= this.divePlanner.getCurrentDepth();
  }

  private getPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  private getPO2WarningMessage(): string | undefined {
    return this.divePlanner.getPO2WarningMessage(this.getPO2());
  }

  private getPO2ErrorMessage(): string | undefined {
    return this.divePlanner.getPO2ErrorMessage(this.getPO2());
  }

  private getEND(): number {
    return ceilingWithThreshold(this.divePlanner.getCurrentGas().getEND(this.newDepth));
  }

  private getENDErrorMessage(): string | undefined {
    return this.divePlanner.getENDErrorMessage(this.getEND());
  }
}
