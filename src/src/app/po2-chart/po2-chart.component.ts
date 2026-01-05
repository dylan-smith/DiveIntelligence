import { Component, OnInit, inject } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
  selector: 'dive-po2-chart',
  templateUrl: './po2-chart.component.html',
  styleUrl: './po2-chart.component.scss',
})
export class PO2ChartComponent implements OnInit {
  divePlanner = inject(DivePlannerService);
  dialog = inject(MatDialog);

  private readonly ERROR_COLOR = 'red';
  private readonly WARNING_COLOR = 'orange';
  private readonly PRIMARY_COLOR = '#3F51B5';

  ngOnInit(): void {
    Plotly.newPlot('po2-chart', this.getPO2ChartData(), this.getPO2ChartLayout(), this.getChartOptions());
  }

  onPO2ChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getPO2ChartData(), layout: this.getPO2ChartLayout(), options: this.getChartOptions() },
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

  private getPO2ChartData(): Plotly.Data[] {
    if (!this.chartData) {
      const pO2Data = this.divePlanner.getPO2ChartData();
      const x = pO2Data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
      const y = pO2Data.map(d => d.pO2);
      const limit = pO2Data.map(d => d.limit);
      const decoLimit = pO2Data.map(d => d.decoLimit);
      const minLimit = pO2Data.map(d => d.min);

      this.chartData = [
        {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          name: 'PO2',
          line: {
            color: this.PRIMARY_COLOR,
            width: 5,
          },
          hovertemplate: `%{y:.2f}`,
        },
        {
          x,
          y: minLimit,
          type: 'scatter',
          mode: 'lines',
          name: 'Min Limit (Hypoxia)',
          marker: {
            color: this.ERROR_COLOR,
          },
          line: {
            dash: 'dot',
            width: 2,
          },
          hovertemplate: `%{y:.2f}`,
        },
        {
          x,
          y: limit,
          type: 'scatter',
          mode: 'lines',
          name: 'Working Limit',
          marker: {
            color: this.WARNING_COLOR,
          },
          line: {
            dash: 'dot',
            width: 2,
          },
          hovertemplate: `%{y:.2f}`,
        },
        {
          x,
          y: decoLimit,
          type: 'scatter',
          mode: 'lines',
          name: 'Deco Limit',
          marker: {
            color: this.ERROR_COLOR,
          },
          line: {
            dash: 'dot',
            width: 2,
          },
          hovertemplate: `%{y:.2f}`,
        },
      ];
    }

    return this.chartData;
  }

  private getPO2ChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Gas PO2',
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
