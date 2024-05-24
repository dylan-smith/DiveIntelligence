import { Component, Input, OnChanges } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';

@Component({
  selector: 'dive-new-time-stats',
  templateUrl: './new-time-stats.component.html',
  styleUrl: './new-time-stats.component.scss',
})
export class NewTimeStatsComponent implements OnChanges {
  @Input() newDepth: number = 0;
  @Input() newGas: BreathingGas = this.divePlanner.getCurrentGas();
  @Input() timeAtDepth: number = 0;

  totalDiveDuration: number = this.getTotalDiveDuration();
  newCeiling: number = this.getNewDecoCeiling();
  decoMilestones!: { duration: number; gas: string; depth: number; tooltip: string }[];
  hasDecoMilestones!: boolean;

  constructor(
    private divePlanner: DivePlannerService,
    private humanDurationPipe: HumanDurationPipe
  ) {}

  ngOnChanges(): void {
    // TODO: change this
    const ceilingData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas);
    this.newCeiling = this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth * 60);

    this.totalDiveDuration = this.getTotalDiveDuration();

    const milestones = this.getDecoMilestones(ceilingData);
    this.decoMilestones = milestones;
    this.hasDecoMilestones = milestones.length > 0;
  }

  private getNewDecoCeiling(): number {
    return this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth * 60);
  }

  private getTotalDiveDuration(): number {
    return this.divePlanner.getDiveDuration() + this.divePlanner.getTravelTime(this.newDepth) + this.timeAtDepth * 60;
  }

  private getDecoMilestones(data: { time: number; ceiling: number }[]): { duration: number; gas: string; depth: number; tooltip: string }[] {
    const ceilingData = data.map(d => Math.ceil(d.ceiling));
    const standardGases = this.divePlanner.getStandardGases();
    const decoGases = standardGases.filter(g => g.maxDecoDepth < ceilingData[0]);
    const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
    let decoComplete = 0;

    for (let t = 0; t < ceilingData.length; t++) {
      for (const gas of decoGases) {
        if (Math.ceil(ceilingData[t]) <= gas.maxDecoDepth) {
          const tooltip = `If you spend ${this.humanDurationPipe.transform(t)} at ${this.newDepth}m, the ceiling will rise to
                           ${ceilingData[t]}m which allow you to ascend and switch to ${gas.name}`;
          milestones.push({ duration: t, gas: gas.name, depth: ceilingData[t], tooltip: tooltip });
          decoGases.splice(decoGases.indexOf(gas), 1);
        }
      }

      if (ceilingData[t] === 0 && decoComplete === 0) {
        decoComplete = t;
      }
    }

    if (ceilingData[0] > 0 && decoComplete > 0) {
      const tooltip = `If you spend ${this.humanDurationPipe.transform(decoComplete)} at
                       ${this.newDepth}m your decompression will be complete and you can ascend directly to the surface`;
      milestones.push({ duration: decoComplete, gas: 'Deco complete', depth: 0, tooltip: tooltip });
    }

    return milestones;
  }
}
