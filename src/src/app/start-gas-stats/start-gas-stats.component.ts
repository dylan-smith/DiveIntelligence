import { Component, Input } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';

@Component({
  selector: 'dive-start-gas-stats',
  templateUrl: './start-gas-stats.component.html',
  styleUrl: './start-gas-stats.component.scss',
})
export class StartGasStatsComponent {
  @Input() gas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);

  constructor(public divePlanner: DivePlannerService) {}

  isMinDepthError(): boolean {
    return this.gas.minDepth > 0;
  }
}
