import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSegment } from '../dive-planner-service/DiveSegment';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrl: './dive-plan.component.scss',
  standalone: false,
})
export class DivePlanComponent {
  planEvents: DiveSegment[];

  constructor(public divePlanner: DivePlannerService) {
    this.planEvents = divePlanner.getDiveSegments();
  }
}
