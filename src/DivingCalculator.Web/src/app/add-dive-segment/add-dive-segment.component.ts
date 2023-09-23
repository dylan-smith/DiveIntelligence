import { Component, OnInit } from '@angular/core';
import { DivePlannerService } from '../dive-planner-service/DivePlannerService';
import { BreathingGas } from '../dive-planner-service/BreathingGas';
import { Router } from '@angular/router';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import * as Plotly from 'plotly.js-basic-dist-min';

@Component({
  selector: 'dive-add-dive-segment',
  templateUrl: './add-dive-segment.component.html',
  styleUrls: ['./add-dive-segment.component.scss'],
})
export class AddDiveSegmentComponent implements OnInit {
  newDepth: number;
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  newGasSelectedOption: string;
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = new BreathingGas('Custom', 21, 0, 79);
  timeAtDepth = 0;

  private readonly ERROR_COLOR = 'red';
  private readonly WARNING_COLOR = 'orange';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    public divePlanner: DivePlannerService,
    private router: Router,
    private humanDurationPipe: HumanDurationPipe
  ) {
    this.newDepth = divePlanner.getCurrentDepth();
    this.newGasSelectedOption = 'current';
  }

  ngOnInit(): void {
    this.drawCeilingChart();
  }

  drawCeilingChart(): void {
    Plotly.react('ceiling-chart', this.getCeilingChartData(), this.getCeilingChartLayout(), this.getCeilingChartOptions());
  }

  public getCeilingChartData(): Plotly.Data[] {
    const depthData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas);
    const x = depthData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = depthData.map(d => d.ceiling);

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

  public getCeilingChartLayout(): Partial<Plotly.Layout> {
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
            color: this.ERROR_COLOR,
            width: 1,
            dash: 'dot',
          },
        },
      ],
    };
  }

  public getCeilingChartOptions(): Partial<Plotly.Config> {
    return {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      autosizable: true,
      scrollZoom: false,
      editable: false,
    };
  }

  onNewDepthInput(): void {
    this.calculateNewGas();
    this.drawCeilingChart();
  }

  onGasTypeChange(): void {
    this.calculateNewGas();
    this.drawCeilingChart();
  }

  onStandardGasSelectionChange(): void {
    this.calculateNewGas();
    this.drawCeilingChart();
  }

  onOxygenInput(): void {
    this.updateCustomGasNitrogen();
    this.drawCeilingChart();
  }

  onHeliumInput(): void {
    this.updateCustomGasNitrogen();
    this.drawCeilingChart();
  }

  onTimeAtDepthInput(): void {
    this.drawCeilingChart();
  }

  calculateNewGas(): void {
    // default it to current gas (e.g. standard is selected but no option picked in dropdown)
    this.newGas = this.divePlanner.getCurrentGas();

    if (this.newGasSelectedOption === 'standard' && this.standardGas !== undefined) {
      this.newGas = this.standardGas;
    }

    if (this.newGasSelectedOption === 'custom') {
      this.newGas = this.customGas;
    }

    if (this.newGasSelectedOption === 'optimal') {
      this.newGas = this.divePlanner.getOptimalDecoGas(this.newDepth);
    }
  }

  getStandardGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'standard';
  }

  getCustomGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'custom';
  }

  updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
    this.calculateNewGas();
  }

  onSave(): void {
    this.divePlanner.addDiveSegment(this.newDepth, this.newGas, this.timeAtDepth * 60);
    this.router.navigate(['/dive-plan']);
  }

  getPO2Warning(pO2: number): string | undefined {
    if (pO2 > 1.4 && pO2 <= 1.6) return 'Oxygen partial pressure should only go above 1.4 during deco stops';
    return undefined;
  }

  getPO2Error(pO2: number): string | undefined {
    if (pO2 > 1.6) return 'Oxygen partial pressure should never go above 1.6';
    if (pO2 < 0.18) return 'Oxygen partial pressure should never go below 0.18';
    return undefined;
  }

  getENDWarning(END: number): string | undefined {
    if (END > 30 && END <= 40) return 'Some divers (e.g. GUE) aim to keep END below 30m';
    return undefined;
  }

  getENDError(END: number): string | undefined {
    if (END > 40) return 'Most divers aim to keep END below 40m';
    return undefined;
  }

  getCurrentPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.divePlanner.getCurrentDepth());
  }

  getCurrentPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getCurrentPO2());
  }

  getCurrentPO2Error(): string | undefined {
    return this.getPO2Error(this.getCurrentPO2());
  }

  getCurrentEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.divePlanner.getCurrentDepth()));
  }

  getCurrentENDWarning(): string | undefined {
    return this.getENDWarning(this.getCurrentEND());
  }

  getCurrentENDError(): string | undefined {
    return this.getENDError(this.getCurrentEND());
  }

  getNewDepthPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  getNewDepthPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewDepthPO2());
  }

  getNewDepthPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewDepthPO2());
  }

  getNewDepthEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.newDepth));
  }

  getNewDepthENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewDepthEND());
  }

  getNewDepthENDError(): string | undefined {
    return this.getENDError(this.getNewDepthEND());
  }

  getDescentDuration(): number | undefined {
    return this.divePlanner.getDescentDuration(this.newDepth);
  }

  getAscentDuration(): number | undefined {
    return this.divePlanner.getAscentDuration(this.newDepth);
  }

  getNewGasPO2(): number {
    return this.newGas.getPO2(this.newDepth);
  }

  getNewGasPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewGasPO2());
  }

  getNewGasPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewGasPO2());
  }

  getNewGasEND(): number {
    return Math.ceil(this.newGas.getEND(this.newDepth));
  }

  getNewGasENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewGasEND());
  }

  getNewGasENDError(): string | undefined {
    return this.getENDError(this.getNewGasEND());
  }

  getNoDecoLimit(): string {
    const ndl = this.divePlanner.getNoDecoLimit(this.newDepth, this.newGas);

    if (ndl === undefined) {
      return '> 5 hours';
    }

    return this.humanDurationPipe.transform(ndl);
  }

  getNewDecoCeiling(): string {
    const ceiling = this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth * 60);

    return `${ceiling}m`;
  }

  getTotalDiveDuration(): number {
    return this.divePlanner.getDiveDuration() + this.divePlanner.getTravelTime(this.newDepth) + this.timeAtDepth * 60;
  }

  getDecoMilestones(): { duration: number; gas: string; depth: number; tooltip: string }[] {
    const ceilingData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas).map(d => Math.ceil(d.ceiling));
    const standardGases = this.divePlanner.getStandardGases();
    const decoGases = standardGases.filter(g => g.getMaxDecoDepth() < ceilingData[0]);
    const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
    let decoComplete = 0;

    for (let t = 0; t < ceilingData.length; t++) {
      for (const gas of decoGases) {
        if (Math.ceil(ceilingData[t]) <= gas.getMaxDecoDepth()) {
          const tooltip = `If you spend ${this.humanDurationPipe.transform(t)} at ${this.newDepth}m, the ceiling will rise to
                           ${ceilingData[t]}m which allow you to ascend and switch to ${gas.Name}`;
          milestones.push({ duration: t, gas: gas.Name, depth: ceilingData[t], tooltip: tooltip });
          decoGases.splice(decoGases.indexOf(gas), 1);
        }
      }

      if (ceilingData[t] === 0 && decoComplete === 0) {
        decoComplete = t;
      }
    }

    if (ceilingData[0] > 0 && decoComplete > 0) {
      const tooltip = `If you spend ${this.humanDurationPipe.transform(decoComplete)} at
                       ${this.newDepth}m your decompression will be complete and you can ascend directly to the surface`;
      milestones.push({ duration: decoComplete, gas: 'Deco complete', depth: 0, tooltip: tooltip });
    }

    return milestones;
  }
}
