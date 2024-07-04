import { Injectable } from '@angular/core';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveProfile } from './DiveProfile';
import { ApplicationInsightsService } from '../application-insights-service/application-insights.service';
import { DiveSettingsService } from './DiveSettings.service';
import { ChartGeneratorService } from './ChartGenerator.service';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  private diveID = crypto.randomUUID();
  private diveProfile: DiveProfile = new DiveProfile(this.settings, this.diveSegmentFactory);

  constructor(
    private diveSegmentFactory: DiveSegmentFactoryService,
    private appInsights: ApplicationInsightsService,
    private chartGenerator: ChartGeneratorService,
    public settings: DiveSettingsService
  ) {
    BreathingGas.GenerateStandardGases(this.settings);
  }

  getStandardGases(): BreathingGas[] {
    return BreathingGas.StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.diveProfile.startDive(startGas);
    this.diveID = crypto.randomUUID();
    this.appInsights.trackEvent('StartDive', {
      diveID: this.diveID,
      startGas: { description: startGas.description, oxygen: startGas.oxygen, helium: startGas.helium, nitrogen: startGas.nitrogen },
    });
  }

  getDiveSegments(): DiveSegment[] {
    return this.diveProfile.segments;
  }

  getDiveDuration(): number {
    return this.diveProfile.getTotalTime();
  }

  getMaxDepth(): number {
    return this.diveProfile.getMaxDepth();
  }

  getAverageDepth(): number {
    return this.diveProfile.getAverageDepth();
  }

  getCurrentDepth(): number {
    return this.diveProfile.getCurrentDepth();
  }

  getOptimalDecoGas(depth: number): BreathingGas {
    return BreathingGas.getOptimalDecoGas(depth, this.settings);
  }

  getCurrentCeiling(): number {
    return this.diveProfile.getCurrentCeiling();
  }

  getCurrentGas(): BreathingGas {
    return this.diveProfile.getCurrentGas();
  }

  getCurrentDiveTime(): number {
    return this.diveProfile.getCurrentDiveTime();
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number | undefined {
    return this.diveProfile.getNoDecoLimit(newDepth, newGas);
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    this.diveProfile.addDiveSegment(newDepth, newGas, timeAtDepth);

    this.appInsights.trackEvent('AddDiveSegment', {
      diveID: this.diveID,
      newDepth,
      newGas: { description: newGas.description, oxygen: newGas.oxygen, helium: newGas.helium, nitrogen: newGas.nitrogen },
      timeAtDepth,
    });
  }

  addChangeDepthSegment(newDepth: number): void {
    this.diveProfile.addChangeDepthSegment(newDepth);
  }

  addChangeGasSegment(newGas: BreathingGas): void {
    this.diveProfile.addChangeGasSegment(newGas);
  }

  getTravelTime(newDepth: number): number {
    return this.diveProfile.getTravelTime(newDepth);
  }

  getDepthChartData(): { time: number; depth: number; ceiling: number }[] {
    return this.chartGenerator.getDepthChartData(this.diveProfile);
  }

  getPO2ChartData(): { time: number; pO2: number; decoLimit: number; limit: number; min: number }[] {
    return this.chartGenerator.getPO2ChartData(this.diveProfile);
  }

  getENDChartData(): { time: number; end: number; errorLimit: number }[] {
    return this.chartGenerator.getENDChartData(this.diveProfile);
  }

  getTissuesCeilingChartData(): { time: number; depth: number; tissuesCeiling: number[] }[] {
    return this.chartGenerator.getTissuesCeilingChartData(this.diveProfile);
  }

  getTissuesPN2ChartData(): { time: number; gasPN2: number; tissuesPN2: number[] }[] {
    return this.chartGenerator.getTissuesPN2ChartData(this.diveProfile);
  }

  getTissuesPHeChartData(): { time: number; gasPHe: number; tissuesPHe: number[] }[] {
    return this.chartGenerator.getTissuesPHeChartData(this.diveProfile);
  }

  getCeilingChartData(newDepth: number, newGas: BreathingGas): { time: number; ceiling: number }[] {
    return this.chartGenerator.getCeilingChartData(newDepth, newGas, this.diveProfile);
  }

  getNewCeiling(newDepth: number, newGas: BreathingGas, timeAtDepth: number): number {
    return this.diveProfile.getNewCeiling(newDepth, newGas, timeAtDepth);
  }

  getCeilingError(): { amount: number; duration: number } {
    return this.diveProfile.getCeilingError();
  }

  getPO2Error(): { maxPO2: number; duration: number } {
    return this.diveProfile.getPO2Error();
  }

  getHypoxicError(): { minPO2: number; duration: number } {
    return this.diveProfile.getHypoxicError();
  }

  getENDError(): { end: number; duration: number } {
    return this.diveProfile.getENDError();
  }

  getPO2WarningMessage(pO2: number): string | undefined {
    if (pO2 > this.settings.workingPO2Maximum && pO2 <= this.settings.decoPO2Maximum)
      return `Oxygen partial pressure should only go above ${this.settings.workingPO2Maximum} during deco stops`;
    return undefined;
  }

  getPO2ErrorMessage(pO2: number): string | undefined {
    if (pO2 > this.settings.decoPO2Maximum) return `Oxygen partial pressure should never go above ${this.settings.decoPO2Maximum}`;
    if (pO2 < this.settings.pO2Minimum) return `Oxygen partial pressure should never go below ${this.settings.pO2Minimum}`;
    return undefined;
  }

  getENDErrorMessage(END: number): string | undefined {
    if (END > this.settings.ENDErrorThreshold) return this.settings.ENDErrorMessage;
    return undefined;
  }
}
