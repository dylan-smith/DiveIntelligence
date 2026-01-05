import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
    selector: 'dive-end-chart',
    templateUrl: './end-chart.component.html',
    styleUrl: './end-chart.component.scss',
    standalone: false
})
export class ENDChartComponent implements OnInit {
  private readonly ERROR_COLOR = 'red';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    Plotly.newPlot('end-chart', this.getENDChartData(), this.getENDChartLayout(), this.getChartOptions());
  }

  onENDChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getENDChartData(), layout: this.getENDChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  getShowGraphs(): boolean {
    return this.divePlanner.getDiveSegments().length > 2;
  }

  getGraphClass(): string {
    return this.getShowGraphs() ? '' : 'hidden';
  }

  private chartData: Plotly.Data[] | null = null;

  private getENDChartData(): Plotly.Data[] {
    if (!this.chartData) {
      const endData = this.divePlanner.getENDChartData();
      const x = endData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
      const y = endData.map(d => d.end);
      const errorLimit = endData.map(d => d.errorLimit);

      this.chartData = [
        {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          name: 'END',
          line: {
            color: this.PRIMARY_COLOR,
            width: 5,
          },
          hovertemplate: `%{y:.0f}m`,
        },
        {
          x,
          y: errorLimit,
          type: 'scatter',
          mode: 'lines',
          name: 'Error Limit',
          marker: {
            color: this.ERROR_COLOR,
          },
          line: {
            dash: 'dot',
            width: 2,
          },
          hovertemplate: `%{y:.0f}m`,
        },
      ];
    }

    return this.chartData;
  }

  private getENDChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Equivalent Narcotic Depth',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
      xaxis: {
        fixedrange: true,
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        fixedrange: true,
        rangemode: 'tozero',
        zeroline: false,
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(200, 200, 200, 0.4)',
        bordercolor: 'rgba(200, 200, 200, 0.4)',
      },
    };
  }

  private getChartOptions(): Partial<Plotly.Config> {
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
