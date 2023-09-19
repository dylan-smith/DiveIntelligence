import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSegment } from '../dive-planner-service/DiveSegment';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrls: ['./dive-plan.component.scss'],
})
export class DivePlanComponent {
  planEvents: DiveSegment[];

  constructor(public divePlanner: DivePlannerService) {
    this.planEvents = divePlanner.getDiveSegments();
  }

  onAddPlanEvent() {
    console.log('Add plan event');
  }
}
