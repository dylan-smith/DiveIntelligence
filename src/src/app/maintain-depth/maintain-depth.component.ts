import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router, RouterLink } from '@angular/router';
import { CurrentStatsComponent } from '../current-stats/current-stats.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NewTimeStatsComponent } from '../new-time-stats/new-time-stats.component';
import { CeilingChartComponent } from '../ceiling-chart/ceiling-chart.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'dive-maintain-depth',
  templateUrl: './maintain-depth.component.html',
  styleUrls: ['./maintain-depth.component.scss'],
  imports: [CurrentStatsComponent, MatFormField, MatLabel, MatInput, FormsModule, NewTimeStatsComponent, CeilingChartComponent, MatButton, RouterLink],
})
export class MaintainDepthComponent {
  private divePlanner = inject(DivePlannerService);
  private router = inject(Router);

  timeAtDepth: number = 0;

  onSave(): void {
    this.divePlanner.addMaintainDepthSegment(this.timeAtDepth * 60);
    this.router.navigate(['/dive-overview']);
  }
}
