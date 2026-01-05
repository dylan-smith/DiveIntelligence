import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router } from '@angular/router';

@Component({
    selector: 'dive-maintain-depth',
    templateUrl: './maintain-depth.component.html',
    styleUrls: ['./maintain-depth.component.scss'],
    standalone: false
})
export class MaintainDepthComponent {
  timeAtDepth: number = 0;

  constructor(
    private divePlanner: DivePlannerService,
    private router: Router
  ) {}

  onSave(): void {
    this.divePlanner.addMaintainDepthSegment(this.timeAtDepth * 60);
    this.router.navigate(['/dive-overview']);
  }
}
