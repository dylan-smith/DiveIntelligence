import { Component } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { Router } from '@angular/router';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

@Component({
  selector: 'dive-change-gas',
  templateUrl: './change-gas.component.html',
  styleUrls: ['./change-gas.component.scss'],
  standalone: false,
})
export class ChangeGasComponent {
  newGas: BreathingGas = this.divePlanner.getCurrentGas();

  constructor(
    private divePlanner: DivePlannerService,
    private router: Router
  ) {}

  onSave(): void {
    this.divePlanner.addChangeGasSegment(this.newGas);
    this.router.navigate(['/dive-overview']);
  }

  onNewGasSelected(newGas: BreathingGas): void {
    this.newGas = newGas;
  }
}
