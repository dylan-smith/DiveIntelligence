import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
  selector: 'dive-tissues-phe-chart',
  templateUrl: './tissues-phe-chart.component.html',
  styleUrl: './tissues-phe-chart.component.scss',
  standalone: false,
})
export class TissuesPHeChartComponent implements OnInit {
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    Plotly.newPlot('tissues-phe-chart', this.getTissuesPHeChartData(), this.getTissuesPHeChartLayout(), this.getChartOptions());
  }

  onTissuesPHeChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getTissuesPHeChartData(), layout: this.getTissuesPHeChartLayout(), options: this.getChartOptions() },
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

  private getTissuesPHeChartData(): Plotly.Data[] {
    if (!this.chartData) {
      const ceilingData = this.divePlanner.getTissuesPHeChartData();
      const x = ceilingData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));

      const tissueTraces: Plotly.Data[] = [];

      for (let i = 1; i <= 16; i++) {
        tissueTraces.push({
          x,
          y: ceilingData.map(d => d.tissuesPHe[i - 1]),
          type: 'scatter',
          mode: 'lines',
          name: `Tissue ${i} PHe`,
          line: {
            width: 2,
          },
          hovertemplate: `%{y:.2f}`,
        });
      }

      this.chartData = [
        {
          x,
          y: ceilingData.map(d => d.gasPHe),
          type: 'scatter',
          mode: 'lines',
          name: 'Gas PHe',
          line: {
            color: this.PRIMARY_COLOR,
            width: 5,
          },
          hovertemplate: `%{y:.2f}`,
        },
        ...tissueTraces,
      ];
    }

    return this.chartData;
  }

  private getTissuesPHeChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Tissues PHe vs Gas PHe',
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
