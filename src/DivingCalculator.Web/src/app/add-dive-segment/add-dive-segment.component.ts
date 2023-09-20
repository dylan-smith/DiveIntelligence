import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-add-dive-segment',
  templateUrl: './add-dive-segment.component.html',
  styleUrls: ['./add-dive-segment.component.scss'],
})
export class AddDiveSegmentComponent {
  constructor(public divePlanner: DivePlannerService) {}
}
