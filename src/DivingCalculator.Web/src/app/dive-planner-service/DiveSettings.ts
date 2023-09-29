export class DiveSettings {
  private _ascentRate = 10;
  private _descentRate = 20;
  private _isOxygenNarcotic = true;
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
}
