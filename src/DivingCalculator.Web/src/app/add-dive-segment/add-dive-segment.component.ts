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
  newDepth: number = this.divePlanner.getCurrentDepth();
  newGas: BreathingGas = this.divePlanner.getCurrentGas();
  newGasSelectedOption = 'current';
  standardGas: BreathingGas | undefined;
  customGas: BreathingGas = new BreathingGas('Custom', 21, 0, 79);
  timeAtDepth = 0;

  // **************************
  currentDepth: number = this.divePlanner.getCurrentDepth();
  currentCeiling: number = this.divePlanner.getCurrentCeiling();
  currentGas: BreathingGas = this.divePlanner.getCurrentGas();
  currentPO2: number = this.getCurrentPO2();
  hasCurrentPO2Warning: boolean = this.getCurrentPO2Warning() !== undefined;
  hasCurrentPO2Error: boolean = this.getCurrentPO2Error() !== undefined;
  currentPO2Warning: string | undefined = this.getCurrentPO2Warning();
  currentPO2Error: string | undefined = this.getCurrentPO2Error();
  currentEND: number = this.getCurrentEND();
  hasCurrentENDWarning: boolean = this.getCurrentENDWarning() !== undefined;
  hasCurrentENDError: boolean = this.getCurrentENDError() !== undefined;
  currentENDWarning: string | undefined = this.getCurrentENDWarning();
  currentENDError: string | undefined = this.getCurrentENDError();

  travelTime: number = this.divePlanner.getTravelTime(this.newDepth);
  isDescent: boolean = this.isNewDepthDescent();
  isAscent = !this.isNewDepthDescent();
  newDepthPO2: number = this.getNewDepthPO2();
  hasNewDepthPO2Warning: boolean = this.getNewDepthPO2Warning() !== undefined;
  hasNewDepthPO2Error: boolean = this.getNewDepthPO2Error() !== undefined;
  newDepthPO2Warning: string | undefined = this.getNewDepthPO2Warning();
  newDepthPO2Error: string | undefined = this.getNewDepthPO2Error();
  newDepthEND: number = this.getNewDepthEND();
  hasNewDepthENDWarning: boolean = this.getNewDepthENDWarning() !== undefined;
  hasNewDepthENDError: boolean = this.getNewDepthENDError() !== undefined;
  newDepthENDWarning: string | undefined = this.getNewDepthENDWarning();
  newDepthENDError: string | undefined = this.getNewDepthENDError();

  StandardGases: BreathingGas[] = BreathingGas.StandardGases;
  optimalGas: BreathingGas = this.divePlanner.getOptimalDecoGas(this.newDepth);
  isStandardGasDisabled: boolean = this.getStandardGasDisabled();
  isCustomGasDisabled: boolean = this.getCustomGasDisabled();

  newGasPO2: number = this.getNewGasPO2();
  hasNewGasPO2Warning: boolean = this.getNewGasPO2Warning() !== undefined;
  hasNewGasPO2Error: boolean = this.getNewGasPO2Error() !== undefined;
  newGasPO2Warning: string | undefined = this.getNewGasPO2Warning();
  newGasPO2Error: string | undefined = this.getNewGasPO2Error();
  newGasEND: number = this.getNewGasEND();
  hasNewGasENDWarning: boolean = this.getNewGasENDWarning() !== undefined;
  hasNewGasENDError: boolean = this.getNewGasENDError() !== undefined;
  newGasENDWarning: string | undefined = this.getNewGasENDWarning();
  newGasENDError: string | undefined = this.getNewGasENDError();
  noDecoLimit: string = this.getNoDecoLimit();

  totalDiveDuration: number = this.getTotalDiveDuration();

  newCeiling: number = this.getNewDecoCeiling();
  decoMilestones!: { duration: number; gas: string; depth: number; tooltip: string }[];
  hasDecoMilestones!: boolean;

  // **************************

  private readonly NEW_DEPTH_COLOR = 'red';
  private readonly PRIMARY_COLOR = '#3F51B5'; // Indigo 500

  constructor(
    private divePlanner: DivePlannerService,
    private router: Router,
    private humanDurationPipe: HumanDurationPipe
  ) {}

  ngOnInit(): void {
    this.drawCeilingChart();
  }

  onNewDepthInput(): void {
    this.calculateNewGas();
    this.drawCeilingChart();

    this.calculateNewDepthStats();

    this.optimalGas = this.divePlanner.getOptimalDecoGas(this.newDepth);

    this.calculateNewGasStats();

    this.totalDiveDuration = this.getTotalDiveDuration();
  }

  onGasTypeChange(): void {
    this.calculateNewGas();
    this.drawCeilingChart();

    this.isStandardGasDisabled = this.getStandardGasDisabled();
    this.isCustomGasDisabled = this.getCustomGasDisabled();

    this.calculateNewGasStats();
  }

  onStandardGasSelectionChange(): void {
    this.calculateNewGas();
    this.drawCeilingChart();

    this.calculateNewGasStats();
  }

  onOxygenInput(): void {
    this.updateCustomGasNitrogen();
    this.drawCeilingChart();

    this.calculateNewGasStats();
  }

  onHeliumInput(): void {
    this.updateCustomGasNitrogen();
    this.drawCeilingChart();

    this.calculateNewGasStats();
  }

  onTimeAtDepthInput(): void {
    this.drawCeilingChart();
    this.totalDiveDuration = this.getTotalDiveDuration();
  }

  private calculateNewGasStats(): void {
    this.newGasPO2 = this.getNewGasPO2();
    this.hasNewGasPO2Warning = this.getNewGasPO2Warning() !== undefined;
    this.hasNewGasPO2Error = this.getNewGasPO2Error() !== undefined;
    this.newGasPO2Warning = this.getNewGasPO2Warning();
    this.newGasPO2Error = this.getNewGasPO2Error();
    this.newGasEND = this.getNewGasEND();
    this.hasNewGasENDWarning = this.getNewGasENDWarning() !== undefined;
    this.hasNewGasENDError = this.getNewGasENDError() !== undefined;
    this.newGasENDWarning = this.getNewGasENDWarning();
    this.newGasENDError = this.getNewGasENDError();
    this.noDecoLimit = this.getNoDecoLimit();
  }

  private calculateNewDepthStats(): void {
    this.travelTime = this.divePlanner.getTravelTime(this.newDepth);
    this.isDescent = this.isNewDepthDescent();
    this.isAscent = !this.isNewDepthDescent();
    this.newDepthPO2 = this.getNewDepthPO2();
    this.hasNewDepthPO2Warning = this.getNewDepthPO2Warning() !== undefined;
    this.hasNewDepthPO2Error = this.getNewDepthPO2Error() !== undefined;
    this.newDepthPO2Warning = this.getNewDepthPO2Warning();
    this.newDepthPO2Error = this.getNewDepthPO2Error();
    this.newDepthEND = this.getNewDepthEND();
    this.hasNewDepthENDWarning = this.getNewDepthENDWarning() !== undefined;
    this.hasNewDepthENDError = this.getNewDepthENDError() !== undefined;
    this.newDepthENDWarning = this.getNewDepthENDWarning();
    this.newDepthENDError = this.getNewDepthENDError();
  }

  private isNewDepthDescent(): boolean {
    return this.newDepth >= this.divePlanner.getCurrentDepth();
  }

  private drawCeilingChart(): void {
    const ceilingData = this.divePlanner.getCeilingChartData(this.newDepth, this.newGas);
    Plotly.react('ceiling-chart', this.getCeilingChartData(ceilingData), this.getCeilingChartLayout(), this.getCeilingChartOptions());

    if (this.timeAtDepth  < 120) {
      this.newCeiling = Math.ceil(ceilingData[this.timeAtDepth * 60].ceiling);
    } else {
      this.newCeiling = this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth);
    }

    const milestones = this.getDecoMilestones(ceilingData);
    this.decoMilestones = milestones;
    this.hasDecoMilestones = milestones.length > 0;
  }

  private getCeilingChartData(data: { time: number; ceiling: number }[]): Plotly.Data[] {
    const x = data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = data.map(d => d.ceiling);

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

  private getCeilingChartLayout(): Partial<Plotly.Layout> {
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
            color: this.NEW_DEPTH_COLOR,
            width: 1,
            dash: 'dot',
          },
        },
      ],
    };
  }

  private getCeilingChartOptions(): Partial<Plotly.Config> {
    return {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      autosizable: true,
      scrollZoom: false,
      editable: false,
    };
  }

  private calculateNewGas(): void {
    // default it to current gas (e.g. standard is selected but no option picked in dropdown)
    this.newGas = this.divePlanner.getCurrentGas();

    if (this.newGasSelectedOption === 'standard' && this.standardGas !== undefined) {
      this.newGas = this.standardGas;
    }

    if (this.newGasSelectedOption === 'custom') {
      this.newGas = this.customGas;
    }

    if (this.newGasSelectedOption === 'optimal') {
      this.newGas = this.optimalGas;
    }
  }

  private getStandardGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'standard';
  }

  private getCustomGasDisabled(): boolean {
    return this.newGasSelectedOption !== 'custom';
  }

  private updateCustomGasNitrogen() {
    this.customGas.Nitrogen = 100 - this.customGas.Oxygen - this.customGas.Helium;
    this.calculateNewGas();
  }

  onSave(): void {
    this.divePlanner.addDiveSegment(this.newDepth, this.newGas, this.timeAtDepth * 60);
    this.router.navigate(['/dive-plan']);
  }

  private getPO2Warning(pO2: number): string | undefined {
    if (pO2 > 1.4 && pO2 <= 1.6) return 'Oxygen partial pressure should only go above 1.4 during deco stops';
    return undefined;
  }

  private getPO2Error(pO2: number): string | undefined {
    if (pO2 > 1.6) return 'Oxygen partial pressure should never go above 1.6';
    if (pO2 < 0.18) return 'Oxygen partial pressure should never go below 0.18';
    return undefined;
  }

  private getENDWarning(END: number): string | undefined {
    if (END > 30 && END <= 40) return 'Some divers (e.g. GUE) aim to keep END below 30m';
    return undefined;
  }

  private getENDError(END: number): string | undefined {
    if (END > 40) return 'Most divers aim to keep END below 40m';
    return undefined;
  }

  private getCurrentPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.divePlanner.getCurrentDepth());
  }

  private getCurrentPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getCurrentPO2());
  }

  private getCurrentPO2Error(): string | undefined {
    return this.getPO2Error(this.getCurrentPO2());
  }

  private getCurrentEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.divePlanner.getCurrentDepth()));
  }

  private getCurrentENDWarning(): string | undefined {
    return this.getENDWarning(this.getCurrentEND());
  }

  private getCurrentENDError(): string | undefined {
    return this.getENDError(this.getCurrentEND());
  }

  private getNewDepthPO2(): number {
    return this.divePlanner.getCurrentGas().getPO2(this.newDepth);
  }

  private getNewDepthPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewDepthPO2());
  }

  private getNewDepthPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewDepthPO2());
  }

  private getNewDepthEND(): number {
    return Math.ceil(this.divePlanner.getCurrentGas().getEND(this.newDepth));
  }

  private getNewDepthENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewDepthEND());
  }

  private getNewDepthENDError(): string | undefined {
    return this.getENDError(this.getNewDepthEND());
  }

  private getNewGasPO2(): number {
    return this.newGas.getPO2(this.newDepth);
  }

  private getNewGasPO2Warning(): string | undefined {
    return this.getPO2Warning(this.getNewGasPO2());
  }

  private getNewGasPO2Error(): string | undefined {
    return this.getPO2Error(this.getNewGasPO2());
  }

  private getNewGasEND(): number {
    return Math.ceil(this.newGas.getEND(this.newDepth));
  }

  private getNewGasENDWarning(): string | undefined {
    return this.getENDWarning(this.getNewGasEND());
  }

  private getNewGasENDError(): string | undefined {
    return this.getENDError(this.getNewGasEND());
  }

  private getNoDecoLimit(): string {
    const ndl = this.divePlanner.getNoDecoLimit(this.newDepth, this.newGas);

    if (ndl === undefined) {
      return '> 5 hours';
    }

    return this.humanDurationPipe.transform(ndl);
  }

  private getNewDecoCeiling(): number {
    return this.divePlanner.getNewCeiling(this.newDepth, this.newGas, this.timeAtDepth * 60);
  }

  private getTotalDiveDuration(): number {
    return this.divePlanner.getDiveDuration() + this.divePlanner.getTravelTime(this.newDepth) + this.timeAtDepth * 60;
  }

  private getDecoMilestones(data: { time: number; ceiling: number }[]): { duration: number; gas: string; depth: number; tooltip: string }[] {
    const ceilingData = data.map(d => Math.ceil(d.ceiling));
    const standardGases = this.divePlanner.getStandardGases();
    const decoGases = standardGases.filter(g => g.MaxDecoDepth < ceilingData[0]);
    const milestones: { duration: number; gas: string; depth: number; tooltip: string }[] = [];
    let decoComplete = 0;

    for (let t = 0; t < ceilingData.length; t++) {
      for (const gas of decoGases) {
        if (Math.ceil(ceilingData[t]) <= gas.MaxDecoDepth) {
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
