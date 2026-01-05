import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DecimalPipe } from '@angular/common';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';

@Component({
  selector: 'dive-dive-summary',
  templateUrl: './dive-summary.component.html',
  styleUrl: './dive-summary.component.scss',
  imports: [DecimalPipe, HumanDurationPipe],
})
export class DiveSummaryComponent {
  divePlanner = inject(DivePlannerService);
}
