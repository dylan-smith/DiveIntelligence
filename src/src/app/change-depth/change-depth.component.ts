import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router } from '@angular/router';

@Component({
    selector: 'dive-change-depth',
    templateUrl: './change-depth.component.html',
    styleUrls: ['./change-depth.component.scss'],
    standalone: false
})
export class ChangeDepthComponent {
  newDepth: number = this.divePlanner.getCurrentDepth();

  constructor(
    private divePlanner: DivePlannerService,
    private router: Router
  ) {}

  onSave(): void {
    this.divePlanner.addChangeDepthSegment(this.newDepth);
    this.router.navigate(['/dive-overview']);
  }
}
