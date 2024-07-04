import { Component, Input, OnChanges } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { ceilingWithThreshold } from '../utility/utility';

@Component({
  selector: 'dive-new-time-stats',
  templateUrl: './new-time-stats.component.html',
  styleUrl: './new-time-stats.component.scss',
})
export class NewTimeStatsComponent implements OnChanges {
  @Input() timeAtDepth: number = 0;

  currentDepth: number = this.divePlanner.getCurrentDepth();
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();
  totalDiveDuration: number = this.getTotalDiveDuration();
  newCeiling: number = this.getNewDecoCeiling();
  ceilingData = this.divePlanner.getCeilingChartData(this.currentDepth, this.currentGas);
  decoMilestones = this.getDecoMilestones(this.ceilingData);
  hasDecoMilestones = this.decoMilestones.length > 0;

  constructor(
    private divePlanner: DivePlannerService,
    private humanDurationPipe: HumanDurationPipe
  ) {}

  ngOnChanges(): void {
    this.newCeiling = this.getNewDecoCeiling();
    this.totalDiveDuration = this.getTotalDiveDuration();
  }

  private getNewDecoCeiling(): number {
    return this.divePlanner.getNewCeiling(this.currentDepth, this.currentGas, this.timeAtDepth * 60);
  }

  private getTotalDiveDuration(): number {
    return this.divePlanner.getCurrentDiveTime() + this.divePlanner.getTravelTime(this.currentDepth) + this.timeAtDepth * 60;
  }

  private getDecoMilestones(data: { time: number; ceiling: number }[]): { duration: number; gas: string; depth: number; tooltip: string }[] {
    const ceilingData = data.map(d => ceilingWithThreshold(d.ceiling));
    const standardGases = this.divePlanner.getStandardGases();
    const decoGases = standardGases.filter(g => g.maxDecoDepth < ceilingData[0]);
    const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
    let decoComplete = 0;

    for (let t = 0; t < ceilingData.length && decoComplete === 0; t++) {
      const gasToRemove: BreathingGas[] = [];
      for (const gas of decoGases) {
        if (ceilingWithThreshold(ceilingData[t]) <= gas.maxDecoDepth) {
          const tooltip = `If you spend ${this.humanDurationPipe.transform(t)} at ${this.currentDepth}m, the ceiling will rise to
                           ${ceilingData[t]}m which allow you to ascend and switch to ${gas.name}`;
          milestones.push({ duration: t, gas: gas.name, depth: ceilingData[t], tooltip: tooltip });
          gasToRemove.push(gas);
        }
      }

      for (const gas of gasToRemove) {
        decoGases.splice(decoGases.indexOf(gas), 1);
      }

      if (ceilingData[t] === 0 && decoComplete === 0) {
        decoComplete = t;
      }
    }

    if (ceilingData[0] > 0 && decoComplete > 0) {
      const tooltip = `If you spend ${this.humanDurationPipe.transform(decoComplete)} at
                       ${this.currentDepth}m your decompression will be complete and you can ascend directly to the surface`;
      milestones.push({ duration: decoComplete, gas: 'Deco complete', depth: 0, tooltip: tooltip });
    }

    return milestones;
  }
}
