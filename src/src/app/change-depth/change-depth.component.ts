import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router, RouterLink } from '@angular/router';
import { CurrentStatsComponent } from '../current-stats/current-stats.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NewDepthStatsComponent } from '../new-depth-stats/new-depth-stats.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'dive-change-depth',
  templateUrl: './change-depth.component.html',
  styleUrls: ['./change-depth.component.scss'],
  imports: [CurrentStatsComponent, MatFormField, MatLabel, MatInput, FormsModule, NewDepthStatsComponent, MatButton, RouterLink],
})
export class ChangeDepthComponent {
  private divePlanner = inject(DivePlannerService);
  private router = inject(Router);

  newDepth: number = this.divePlanner.getCurrentDepth();

  onSave(): void {
    this.divePlanner.addChangeDepthSegment(this.newDepth);
    this.router.navigate(['/dive-overview']);
  }
}
