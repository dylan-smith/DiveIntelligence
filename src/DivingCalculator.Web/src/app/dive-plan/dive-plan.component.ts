import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { DiveSegment } from '../dive-planner-service/DiveSegment';
import * as Plotly from 'plotly.js-basic-dist-min';
import { MatDialog } from '@angular/material/dialog';
import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

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

  constructor(
    public divePlanner: DivePlannerService,
    public dialog: MatDialog
  ) {
    this.planEvents = divePlanner.getDiveSegments();
  }

  ngOnInit(): void {
    this.drawCharts();
  }

  private drawCharts(): void {
    Plotly.newPlot('depth-chart', this.getDepthChartData(), this.getDepthChartLayout(), this.getChartOptions());
    Plotly.newPlot('po2-chart', this.getPO2ChartData(), this.getPO2ChartLayout(), this.getChartOptions());
    Plotly.newPlot('end-chart', this.getENDChartData(), this.getENDChartLayout(), this.getChartOptions());
    Plotly.newPlot('tissues-ceiling-chart', this.getTissuesCeilingChartData(), this.getTissuesCeilingChartLayout(), this.getChartOptions());
    Plotly.newPlot('tissues-pn2-chart', this.getTissuesPN2ChartData(), this.getTissuesPN2ChartLayout(), this.getChartOptions());
    Plotly.newPlot('tissues-phe-chart', this.getTissuesPHeChartData(), this.getTissuesPHeChartLayout(), this.getChartOptions());
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

  public getTissuesCeilingChartData(): Plotly.Data[] {
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

    return [
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

  public getTissuesPN2ChartData(): Plotly.Data[] {
    const ceilingData = this.divePlanner.getTissuesPN2ChartData();
    const x = ceilingData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));

    const tissueTraces: Plotly.Data[] = [];

    for (let i = 1; i <= 16; i++) {
      tissueTraces.push({
        x,
        y: ceilingData.map(d => d.tissuesPN2[i - 1]),
        type: 'scatter',
        mode: 'lines',
        name: `Tissue ${i} PN2`,
        line: {
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      });
    }

    return [
      {
        x,
        y: ceilingData.map(d => d.gasPN2),
        type: 'scatter',
        mode: 'lines',
        name: 'Gas PN2',
        line: {
          color: this.PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.2f}`,
      },
      ...tissueTraces,
    ];
  }

  public getTissuesPHeChartData(): Plotly.Data[] {
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

    return [
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

  public getTissuesCeilingChartLayout(): Partial<Plotly.Layout> {
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

  public getTissuesPN2ChartLayout(): Partial<Plotly.Layout> {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Tissues PN<sub>2</sub> vs Gas PN<sub>2</sub>',
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

  public getTissuesPHeChartLayout(): Partial<Plotly.Layout> {
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

  public getHypoxicErrorAmount(): number {
    return this.divePlanner.getHypoxicError().minPO2;
  }

  public getHypoxicErrorDuration(): number {
    return this.divePlanner.getHypoxicError().duration;
  }

  public showHypoxicError(): boolean {
    return this.getHypoxicErrorDuration() > 0;
  }

  public getENDErrorAmount(): number {
    return this.divePlanner.getENDError().end;
  }

  public getENDErrorDuration(): number {
    return this.divePlanner.getENDError().duration;
  }

  public showENDError(): boolean {
    return this.getENDErrorDuration() > 0;
  }

  public onDepthChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getDepthChartData(), layout: this.getDepthChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  public onPO2ChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getPO2ChartData(), layout: this.getPO2ChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  public onENDChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getENDChartData(), layout: this.getENDChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  public onTissuesCeilingChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getTissuesCeilingChartData(), layout: this.getTissuesCeilingChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  public onTissuesPN2ChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getTissuesPN2ChartData(), layout: this.getTissuesPN2ChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }

  public onTissuesPHeChartClick(): void {
    if (this.getShowGraphs()) {
      this.dialog.open(GraphDialogComponent, {
        data: { trace: this.getTissuesPHeChartData(), layout: this.getTissuesPHeChartLayout(), options: this.getChartOptions() },
        height: '80%',
        width: '80%',
      });
    }
  }
}
