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
    Plotly.newPlot('depth-chart', this.getDepthChartData(), this.getDepthChartLayout(), this.getChartOptions());
    Plotly.newPlot('po2-chart', this.getPO2ChartData(), this.getPO2ChartLayout(), this.getChartOptions());
  }

  public getDepthChartData(): Plotly.Data[] {
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

  public getPO2ChartData(): Plotly.Data[] {
    const pO2Data = this.divePlanner.getPO2ChartData();
    const x = pO2Data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = pO2Data.map(d => d.pO2);
    const limit = pO2Data.map(d => d.limit);
    const decoLimit = pO2Data.map(d => d.decoLimit);
    const minLimit = pO2Data.map(d => d.min);

    return [
      {
        x,
        y,
        type: 'scatter',
        mode: 'lines',
        name: 'PO2',
        line: {
          color: 'rgb(31, 119, 180)',
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
        // fill: 'tozeroy',
        marker: {
          color: 'red',
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
          color: 'lightpink',
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
        // fill: 'tozeroy',
        marker: {
          color: 'red',
        },
        line: {
          dash: 'dot',
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
    ];
  }

  public getDepthChartLayout(): Partial<Plotly.Layout> {
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
        bordercolor: 'rgba(200, 200, 200, 0.4)',
      },
    };
  }

  public getPO2ChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Gas PO2',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 20, t: 20 },
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
        bordercolor: 'rgba(200, 200, 200, 0.25)',
      },
    };
  }

  public getChartOptions(): Partial<Plotly.Config> {
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
