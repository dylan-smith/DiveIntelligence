import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSegment } from '../dive-planner-service/DiveSegment';
import * as Plotly from 'plotly.js-basic-dist-min';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrls: ['./dive-plan.component.scss'],
})
export class DivePlanComponent implements OnInit {
  planEvents: DiveSegment[];

  constructor(public divePlanner: DivePlannerService) {
    this.planEvents = divePlanner.getDiveSegments();
  }

  ngOnInit(): void {
    this.drawChart();
  }

  private drawChart(): void {
    Plotly.newPlot('plotly-chart', this.getPlotlyData(), this.getLayout(), this.getOptions());
  }

  public getPlotlyData(): Plotly.Data[] {
    const depthData = this.divePlanner.getDepthChartData();
    const x = depthData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = depthData.map(d => d.depth);
    const y2 = depthData.map(d => d.ceiling);

    return [
      {
        x,
        y,
        type: 'scatter',
        mode: 'lines',
        name: 'Depth',
        line: {
          color: 'rgb(31, 119, 180)',
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
          color: 'lightpink',
        },
        line: {
          dash: 'dot',
          width: 0,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  }

  public getLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Depth vs Ceiling',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 20, t: 20 },
      xaxis: {
        fixedrange: true,
        // title: 'Time (HH:MM:SS)',
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        fixedrange: true,
        autorange: 'reversed',
        // title: 'Depth (M)',
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(200, 200, 200, 0.25)',
        bordercolor: 'rgba(200, 200, 200, 0.25)',
      },
    };
  }

  public getOptions(): Partial<Plotly.Config> {
    return {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      autosizable: true,
      scrollZoom: false,
      editable: false,
    };
  }

  public getShowGraphs(): boolean {
    return this.divePlanner.getDiveSegments().length > 2;
  }

  public getGraphClass(): string {
    return this.getShowGraphs() ? '' : 'hidden';
  }
}
