import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiveSettingsService {
  private _ascentRate = 10;
  private _descentRate = 20;
  private _isOxygenNarcotic = true;
  private _workingPO2Maximum = 1.4;
  private _decoPO2Maximum = 1.6;
  private _pO2Minimum = 0.18;
  private _ENDWarningThreshold = 30;
  private _ENDErrorThreshold = 40;
  private _subscribers: (() => void)[] = [];

  subscribeToChanges(callback: () => void): void {
    this._subscribers.push(callback);
  }

  private onSettingChange(): void {
    this._subscribers.forEach(x => x());
  }

  set ascentRate(rate: number) {
    this._ascentRate = rate;
    this.onSettingChange();
  }

  get ascentRate(): number {
    return this._ascentRate;
  }

  set descentRate(rate: number) {
    this._descentRate = rate;
    this.onSettingChange();
  }

  get descentRate(): number {
    return this._descentRate;
  }

  set isOxygenNarcotic(isNarcotic: boolean) {
    this._isOxygenNarcotic = isNarcotic;
    this.onSettingChange();
  }

  get isOxygenNarcotic(): boolean {
    return this._isOxygenNarcotic;
  }

  set workingPO2Maximum(threshold: number) {
    this._workingPO2Maximum = threshold;
    this.onSettingChange();
  }

  get workingPO2Maximum(): number {
    return this._workingPO2Maximum;
  }

  set decoPO2Maximum(threshold: number) {
    this._decoPO2Maximum = threshold;
    this.onSettingChange();
  }

  get decoPO2Maximum(): number {
    return this._decoPO2Maximum;
  }

  get pO2Minimum(): number {
    return this._pO2Minimum;
  }

  set pO2Minimum(value: number) {
    this._pO2Minimum = value;
    this.onSettingChange();
  }

  set ENDWarningThreshold(threshold: number) {
    this._ENDWarningThreshold = threshold;
    this.onSettingChange();
  }

  get ENDWarningThreshold(): number {
    return this._ENDWarningThreshold;
  }

  set ENDErrorThreshold(threshold: number) {
    this._ENDErrorThreshold = threshold;
    this.onSettingChange();
  }

  get ENDErrorThreshold(): number {
    return this._ENDErrorThreshold;
  }

  get ENDWarningMessage(): string {
    if (this._ENDWarningThreshold === 30) {
      return `Some divers (e.g. GUE) aim to keep END below ${this._ENDWarningThreshold}m`;
    }

    return `END is above the configured warning threshold of ${this._ENDWarningThreshold}m`;
  }

  get ENDErrorMessage(): string {
    if (this._ENDErrorThreshold === 40) {
      return `Most divers aim to keep END below ${this._ENDErrorThreshold}m`;
    }

    return `END is above the configured error threshold of ${this._ENDErrorThreshold}m`;
  }

  get MaxDepthPO2Tooltip(): string {
    return `Maximum depth this gas can be breathed at without going over an oxygen partial pressure of ${this.workingPO2Maximum} (${this.decoPO2Maximum} for deco stops)`;
  }

  get MaxDepthENDTooltip(): string {
    return `Maximum depth this gas can be breathed at before you experience narcosis equivalent to ${this._ENDErrorThreshold}m on air`;
  }

  get MinDepthTooltip(): string {
    return `Minimum depth this gas can be breathed at before you experience hypoxia (PO2 < ${this.pO2Minimum})`;
  }
}
