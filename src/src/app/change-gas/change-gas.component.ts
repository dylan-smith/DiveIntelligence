import { Component, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router, RouterLink } from '@angular/router';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { CurrentStatsComponent } from '../current-stats/current-stats.component';
import { NewGasInputComponent } from '../new-gas-input/new-gas-input.component';
import { NewGasStatsComponent } from '../new-gas-stats/new-gas-stats.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'dive-change-gas',
  templateUrl: './change-gas.component.html',
  styleUrls: ['./change-gas.component.scss'],
  imports: [CurrentStatsComponent, NewGasInputComponent, NewGasStatsComponent, MatButton, RouterLink],
})
export class ChangeGasComponent {
  private divePlanner = inject(DivePlannerService);
  private router = inject(Router);

  newGas: BreathingGas = this.divePlanner.getCurrentGas();

  onSave(): void {
    this.divePlanner.addChangeGasSegment(this.newGas);
    this.router.navigate(['/dive-overview']);
  }

  onNewGasSelected(newGas: BreathingGas): void {
    this.newGas = newGas;
  }
}
