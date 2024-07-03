import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-error-list',
  templateUrl: './error-list.component.html',
  styleUrl: './error-list.component.scss',
})
export class ErrorListComponent {
  constructor(public divePlanner: DivePlannerService) {}

  public getCeilingErrorAmount(): number {
    return this.divePlanner.getCeilingError().amount;
  }

  public getCeilingErrorDuration(): number {
    return this.divePlanner.getCeilingError().duration;
  }

  public showCeilingError(): boolean {
    return this.getCeilingErrorDuration() > 0;
  }

  public getPO2ErrorAmount(): number {
    return this.divePlanner.getPO2Error().maxPO2;
  }

  public getPO2ErrorDuration(): number {
    return this.divePlanner.getPO2Error().duration;
  }

  public showPO2Error(): boolean {
    return this.getPO2ErrorDuration() > 0;
  }

  public getHypoxicErrorAmount(): number {
    return this.divePlanner.getHypoxicError().minPO2;
  }

  public getHypoxicErrorDuration(): number {
    return this.divePlanner.getHypoxicError().duration;
  }

  public showHypoxicError(): boolean {
    return this.getHypoxicErrorDuration() > 0;
  }

  public getENDErrorAmount(): number {
    return this.divePlanner.getENDError().end;
  }

  public getENDErrorDuration(): number {
    return this.divePlanner.getENDError().duration;
  }

  public showENDError(): boolean {
    return this.getENDErrorDuration() > 0;
  }
}
