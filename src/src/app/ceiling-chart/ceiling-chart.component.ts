import { Component, Input, OnChanges } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { MatDialog } from '@angular/material/dialog';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';
import * as Plotly from 'plotly.js-basic-dist-min';

@Component({
  selector: 'dive-ceiling-chart',
  templateUrl: './ceiling-chart.component.html',
  styleUrl: './ceiling-chart.component.scss',
})
export class CeilingChartComponent implements OnChanges {
  @Input() timeAtDepth: number = 0;

  currentDepth: number = this.divePlanner.getCurrentDepth();
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();

  private readonly NEW_DEPTH_COLOR = 'red';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500
  private ceilingData = this.divePlanner.getCeilingChartData(this.currentDepth, this.currentGas);
  private ceilingChartData = this.getCeilingChartData(this.ceilingData);

  constructor(
    private divePlanner: DivePlannerService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    Plotly.react('ceiling-chart', this.ceilingChartData, this.getCeilingChartLayout(), this.getCeilingChartOptions());
  }

  public onCeilingChartClick(): void {
    this.dialog.open(GraphDialogComponent, {
      data: { trace: this.ceilingChartData, layout: this.getCeilingChartLayout(), options: this.getCeilingChartOptions() },
      height: '80%',
      width: '80%',
    });
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
}
