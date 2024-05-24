import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { Router } from '@angular/router';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
  selector: 'dive-add-dive-segment',
  templateUrl: './add-dive-segment.component.html',
  styleUrls: ['./add-dive-segment.component.scss'],
})
export class AddDiveSegmentComponent implements OnInit {
  newDepth: number = this.divePlanner.getCurrentDepth();
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  timeAtDepth: number = 0;

  // **************************

  totalDiveDuration: number = this.getTotalDiveDuration();

  newCeiling: number = this.getNewDecoCeiling();
  decoMilestones!: { duration: number; gas: string; depth: number; tooltip: string }[];
  hasDecoMilestones!: boolean;

  // **************************

  private readonly NEW_DEPTH_COLOR = 'red';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    private router: Router,
    private humanDurationPipe: HumanDurationPipe,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.drawCeilingChart();
  }

  onNewDepthInput(): void {
    this.drawCeilingChart();
    this.totalDiveDuration = this.getTotalDiveDuration();
  }

  onTimeAtDepthInput(): void {
    this.drawCeilingChart();
    this.totalDiveDuration = this.getTotalDiveDuration();
  }

  onSave(): void {
    this.divePlanner.addDiveSegment(this.newDepth, this.newGas, this.timeAtDepth * 60);
    this.router.navigate(['/dive-overview']);
  }

  onNewGasSelected(newGas: BreathingGas): void {
    this.newGas = newGas;
    this.drawCeilingChart();
  }

  private drawCeilingChart(): void {
    const ceilingData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas);
    Plotly.react('ceiling-chart', this.getCeilingChartData(ceilingData), this.getCeilingChartLayout(), this.getCeilingChartOptions());

    if (this.timeAtDepth < 120) {
      this.newCeiling = Math.ceil(ceilingData[this.timeAtDepth * 60].ceiling);
    } else {
      this.newCeiling = this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth * 60);
    }

    const milestones = this.getDecoMilestones(ceilingData);
    this.decoMilestones = milestones;
    this.hasDecoMilestones = milestones.length > 0;
  }

  private getCeilingChartData(data: { time: number; ceiling: number }[]): Plotly.Data[] {
    const x = data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = data.map(d => d.ceiling);

    return [
      {
        x,
        y,
        type: 'scatter',
        mode: 'lines',
        name: 'Ceiling',
        line: {
          color: this.PRIMARY_COLOR,
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  }

  private getCeilingChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: false,
      showlegend: false,
      title: {
        text: 'Ceiling Over Time',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
      xaxis: {
        fixedrange: true,
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        fixedrange: true,
        autorange: 'reversed',
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(200, 200, 200, 0.25)',
        bordercolor: 'rgba(200, 200, 200, 0.4)',
      },
      shapes: [
        {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: new Date(1970, 1, 1, 0, 0, this.timeAtDepth * 60, 0),
          x1: new Date(1970, 1, 1, 0, 0, this.timeAtDepth * 60, 0),
          y0: 0,
          y1: 1,
          line: {
            color: this.NEW_DEPTH_COLOR,
            width: 1,
            dash: 'dot',
          },
        },
      ],
    };
  }

  private getCeilingChartOptions(): Partial<Plotly.Config> {
    return {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      autosizable: true,
      scrollZoom: false,
      editable: false,
    };
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

  public onCeilingChartClick(): void {
    const ceilingData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas);

    this.dialog.open(GraphDialogComponent, {
      data: { trace: this.getCeilingChartData(ceilingData), layout: this.getCeilingChartLayout(), options: this.getCeilingChartOptions() },
      height: '80%',
      width: '80%',
    });
  }
}
