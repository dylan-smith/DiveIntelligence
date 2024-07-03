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
  newDepth: number = this.divePlanner.getCurrentDepth();
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  timeAtDepth: number = 0;

  constructor(
    public divePlanner: DivePlannerService,
    private router: Router
  ) {}

  onSave(): void {
    this.divePlanner.addDiveSegment(this.newDepth, this.newGas, this.timeAtDepth * 60);
    this.router.navigate(['/dive-overview']);
  }

  onNewGasSelected(newGas: BreathingGas): void {
    this.newGas = newGas;
  }
}
