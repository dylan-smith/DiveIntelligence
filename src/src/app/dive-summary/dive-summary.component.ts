import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-dive-summary',
  templateUrl: './dive-summary.component.html',
  styleUrl: './dive-summary.component.scss',
})
export class DiveSummaryComponent {
  constructor(public divePlanner: DivePlannerService) {}
}
