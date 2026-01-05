import { Component, Input, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'dive-start-gas-stats',
  templateUrl: './start-gas-stats.component.html',
  styleUrl: './start-gas-stats.component.scss',
  imports: [MatTooltip, MatIcon],
})
export class StartGasStatsComponent {
  divePlanner = inject(DivePlannerService);

  @Input() gas: BreathingGas = BreathingGas.create(21, 0, 79, this.divePlanner.settings);

  isMinDepthError(): boolean {
    return this.gas.minDepth > 0;
  }
}
