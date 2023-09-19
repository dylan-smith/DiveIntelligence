import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { IDiveSegment } from '../dive-planner-service/IDiveSegment';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrls: ['./dive-plan.component.scss'],
})
export class DivePlanComponent {
  planEvents: IDiveSegment[];

  constructor(private divePlanner: DivePlannerService) {
    this.planEvents = divePlanner.getDiveSegments();
  }

  onAddPlanEvent() {
    console.log('Add plan event');
  }
}
