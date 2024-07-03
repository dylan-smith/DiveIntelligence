import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';
import * as Plotly from 'plotly.js-basic-dist-min';

@Component({
  selector: 'dive-depth-chart',
  templateUrl: './depth-chart.component.html',
  styleUrl: './depth-chart.component.scss',
})
export class DepthChartComponent implements OnInit {
  private readonly ERROR_COLOR = 'red';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    Plotly.newPlot('depth-chart', this.getDepthChartData(), this.getDepthChartLayout(), this.getChartOptions());
  }

  onDepthChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getDepthChartData(), layout: this.getDepthChartLayout(), options: this.getChartOptions() },
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

  private getDepthChartData(): Plotly.Data[] {
    if (!this.chartData) {
      const depthData = this.divePlanner.getDepthChartData();
      const x = depthData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
      const y = depthData.map(d => d.depth);
      const y2 = depthData.map(d => d.ceiling);

      this.chartData = [
        {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          name: 'Depth',
          line: {
            color: this.PRIMARY_COLOR,
            width: 5,
          },
          hovertemplate: `%{y:.0f}m`,
        },
        {
          x,
          y: y2,
          type: 'scatter',
          mode: 'lines',
          name: 'Ceiling',
          fill: 'tozeroy',
          marker: {
            color: this.ERROR_COLOR,
          },
          line: {
            dash: 'dot',
            width: 0,
          },
          hovertemplate: `%{y:.0f}m`,
        },
      ];
    }

    return this.chartData;
  }

  private getDepthChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Depth vs Ceiling',
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
