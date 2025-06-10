import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';

@Component({
  selector: 'dive-dive-summary',
  templateUrl: './dive-summary.component.html',
  styleUrl: './dive-summary.component.scss',
})
export class DiveSummaryComponent {
  constructor(public divePlanner: DivePlannerService) {}

  getTimeToFlyFormatted(): string {
    const timeToFly = this.divePlanner.getTimeToFly();
    
    if (timeToFly === undefined) {
      return '> 5 hours';
    }
    
    if (timeToFly === 0) {
      return 'None';
    }
    
    const hours = Math.floor(timeToFly / 3600);
    const minutes = Math.floor((timeToFly % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  }
}
