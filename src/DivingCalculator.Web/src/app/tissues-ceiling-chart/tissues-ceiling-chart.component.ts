import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
  selector: 'dive-tissues-ceiling-chart',
  templateUrl: './tissues-ceiling-chart.component.html',
  styleUrl: './tissues-ceiling-chart.component.scss',
})
export class TissuesCeilingChartComponent implements OnInit {
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    Plotly.newPlot('tissues-ceiling-chart', this.getTissuesCeilingChartData(), this.getTissuesCeilingChartLayout(), this.getChartOptions());
  }

  onTissuesCeilingChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getTissuesCeilingChartData(), layout: this.getTissuesCeilingChartLayout(), options: this.getChartOptions() },
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

  private getTissuesCeilingChartData(): Plotly.Data[] {
    if (!this.chartData) {
      const ceilingData = this.divePlanner.getTissuesCeilingChartData();
      const x = ceilingData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));

      const ceilingTraces: Plotly.Data[] = [];

      for (let i = 1; i <= 16; i++) {
        ceilingTraces.push({
          x,
          y: ceilingData.map(d => d.tissuesCeiling[i - 1]),
          type: 'scatter',
          mode: 'lines',
          name: `Tissue ${i} Ceiling`,
          line: {
            width: 2,
          },
          hovertemplate: `%{y:.0f}m`,
        });
      }

      this.chartData = [
        {
          x,
          y: ceilingData.map(d => d.depth),
          type: 'scatter',
          mode: 'lines',
          name: 'Depth',
          line: {
            color: this.PRIMARY_COLOR,
            width: 5,
          },
          hovertemplate: `%{y:.0f}m`,
        },
        ...ceilingTraces,
      ];
    }

    return this.chartData;
  }

  private getTissuesCeilingChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Tissues Ceiling vs Depth',
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
