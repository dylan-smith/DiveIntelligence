import { DiveSettings } from './DiveSettings';

export class BreathingGas {
  Name: string;
  Oxygen: number;
  Helium: number;
  Nitrogen: number;
  Description!: string;
  CompositionDescription!: string;
  MaxDepthPO2!: number;
  MaxDepthPO2Deco!: number;
  MaxDepthEND!: number;
  MinDepth!: number;
  MaxDecoDepth!: number;
  private _diveSettings: DiveSettings;

  private constructor(name: string, oxygen: number, helium: number, nitrogen: number, diveSettings: DiveSettings) {
    this.Name = name;
    this.Oxygen = oxygen;
    this.Helium = helium;
    this.Nitrogen = nitrogen;

    this._diveSettings = diveSettings;
    this._diveSettings.subscribeToChanges(() => this.onDiveSettingsChanged());

    this.updateDetails();
  }

  onDiveSettingsChanged(): void {
    this.updateDetails();
  }

  static create(oxygen: number, helium: number, nitrogen: number, settings: DiveSettings): BreathingGas {
    const gas = new BreathingGas('Custom', oxygen, helium, nitrogen, settings);

    const standardGas = BreathingGas.StandardGases.find(g => g.isEquivalent(gas));
    if (standardGas !== undefined) {
      return new BreathingGas(standardGas.Name, standardGas.Oxygen, standardGas.Helium, standardGas.Nitrogen, settings);
    }

    return gas;
  }

  updateDetails(): void {
    this.Description = this.getDescription();
    this.CompositionDescription = this.getCompositionDescription();
    this.MaxDepthPO2 = this.getMaxDepthPO2();
    this.MaxDepthPO2Deco = this.getMaxDepthPO2Deco();
    this.MaxDepthEND = this.getMaxDepthEND();
    this.MinDepth = this.getMinDepth();
    this.MaxDecoDepth = this.getMaxDecoDepth();
  }

  static StandardGases: BreathingGas[];

  static GenerateStandardGases(settings: DiveSettings) {
    this.StandardGases = [
      new BreathingGas('Air', 21, 0, 79, settings),
      new BreathingGas('Nitrox 32', 32, 0, 68, settings),
      new BreathingGas('Oxygen', 100, 0, 0, settings),
      new BreathingGas('Helitrox 25/25', 25, 25, 50, settings),
      new BreathingGas('Helitrox 21/35', 21, 35, 44, settings),
      new BreathingGas('Trimix 18/45', 18, 45, 37, settings),
      new BreathingGas('Trimix 15/55', 15, 55, 30, settings),
      new BreathingGas('Trimix 12/60', 12, 60, 28, settings),
      new BreathingGas('Trimix 10/70', 10, 70, 20, settings),
      new BreathingGas('Nitrox 50', 50, 0, 50, settings),
      new BreathingGas('Helitrox 35/25', 35, 25, 40, settings),
    ];
  }

  private getDescription(): string {
    return `${this.Name} (${this.getCompositionDescription()})`;
  }

  private getCompositionDescription(): string {
    return `O<sub>2</sub>: ${this.Oxygen}%, He: ${this.Helium}%, N<sub>2</sub>: ${this.Nitrogen}%`;
  }

  private getMaxDepthPO2(): number {
    return Math.floor(1400 / this.Oxygen - 10);
  }

  private getMaxDepthPO2Deco(): number {
    return Math.floor(1600 / this.Oxygen - 10);
  }

  private getMaxDepthEND(): number {
    if (this._diveSettings.isOxygenNarcotic) {
      return Math.floor(5000 / (this.Nitrogen + this.Oxygen) - 10);
    } else {
      return Math.floor(3950 / this.Nitrogen - 10);
    }
  }

  private getMinDepth(): number {
    return Math.max(0, Math.ceil(180 / this.Oxygen - 10));
  }

  getPO2(depth: number): number {
    return (depth / 10 + 1) * (this.Oxygen / 100);
  }

  getPHe(depth: number): number {
    return (depth / 10 + 1) * (this.Helium / 100);
  }

  getPN2(depth: number): number {
    return (depth / 10 + 1) * (this.Nitrogen / 100);
  }

  getEND(depth: number): number {
    if (this._diveSettings.isOxygenNarcotic) {
      return Math.max(0, (this.getPN2(depth) + this.getPO2(depth) - 1) * 10);
    }

    return Math.max(0, (this.getPN2(depth) / 0.79 - 1) * 10);
  }

  isEquivalent(other: BreathingGas): boolean {
    return this.Oxygen === other.Oxygen && this.Helium === other.Helium && this.Nitrogen === other.Nitrogen;
  }

  private getMaxDecoDepth(): number {
    return Math.min(this.getMaxDepthPO2Deco(), this.getMaxDepthEND());
  }
}
