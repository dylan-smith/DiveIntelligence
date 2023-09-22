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

  private readonly ERROR_COLOR = 'red';
  private readonly WARNING_COLOR = 'orange';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(public divePlanner: DivePlannerService) {
    this.planEvents = divePlanner.getDiveSegments();
  }

  ngOnInit(): void {
    this.drawChart();
  }

  private drawChart(): void {
    Plotly.newPlot('depth-chart', this.getDepthChartData(), this.getDepthChartLayout(), this.getChartOptions());
    Plotly.newPlot('po2-chart', this.getPO2ChartData(), this.getPO2ChartLayout(), this.getChartOptions());
    Plotly.newPlot('end-chart', this.getENDChartData(), this.getENDChartLayout(), this.getChartOptions());
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

  public getENDChartData(): Plotly.Data[] {
    const endData = this.divePlanner.getENDChartData();
    const x = endData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = endData.map(d => d.end);
    const warningLimit = endData.map(d => d.warningLimit);
    const errorLimit = endData.map(d => d.errorLimit);

    return [
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
        y: warningLimit,
        type: 'scatter',
        mode: 'lines',
        name: 'Warning Limit',
        marker: {
          color: this.WARNING_COLOR,
        },
        line: {
          dash: 'dot',
          width: 2,
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

  public getDepthChartLayout(): Partial<Plotly.Layout> {
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

  public getPO2ChartLayout(): Partial<Plotly.Layout> {
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

  public getENDChartLayout(): Partial<Plotly.Layout> {
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

  public getCeilingErrorAmount(): number {
    return this.divePlanner.getCeilingError().amount;
  }

  public getCeilingErrorDuration(): number {
    return this.divePlanner.getCeilingError().duration;
  }

  public showCeilingError(): boolean {
    return this.getCeilingErrorDuration() > 0;
  }

  public getPO2ErrorAmount(): number {
    return this.divePlanner.getPO2Error().maxPO2;
  }

  public getPO2ErrorDuration(): number {
    return this.divePlanner.getPO2Error().duration;
  }

  public showPO2Error(): boolean {
    return this.getPO2ErrorDuration() > 0;
  }
}
