import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSegment } from '../dive-planner-service/DiveSegment';
import { MatSelectionList, MatListItem, MatListItemTitle, MatListItemLine } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { ColonDurationPipe } from '../pipes/colon-duration.pipe';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrl: './dive-plan.component.scss',
  imports: [MatSelectionList, MatListItem, MatListItemTitle, MatIcon, MatListItemLine, MatFabButton, RouterLink, MatTooltip, ColonDurationPipe],
})
export class DivePlanComponent {
  divePlanner = inject(DivePlannerService);

  planEvents: DiveSegment[];

  constructor() {
    const divePlanner = this.divePlanner;

    this.planEvents = divePlanner.getDiveSegments();
  }
}
