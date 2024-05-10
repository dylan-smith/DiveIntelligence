import { DiveSettingsService } from './DiveSettings.service';

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
  private _diveSettings: DiveSettingsService;

  private constructor(name: string, oxygen: number, helium: number, nitrogen: number, diveSettings: DiveSettingsService) {
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

  static create(oxygen: number, helium: number, nitrogen: number, settings: DiveSettingsService): BreathingGas {
    const gas = new BreathingGas('Custom', oxygen, helium, nitrogen, settings);

    const standardGas = BreathingGas.StandardGases.find(g => g.isEquivalent(gas));
    if (standardGas !== undefined) {
      return new BreathingGas(standardGas.Name, standardGas.Oxygen, standardGas.Helium, standardGas.Nitrogen, settings);
    }

    return gas;
  }

  updateDetails(): void {
    this.Description = this.calcDescription();
    this.CompositionDescription = this.calcCompositionDescription();
    this.MaxDepthPO2 = this.calcMaxDepthPO2();
    this.MaxDepthPO2Deco = this.calcMaxDepthPO2Deco();
    this.MaxDepthEND = this.calcMaxDepthEND();
    this.MinDepth = this.calcMinDepth();
    this.MaxDecoDepth = this.calcMaxDecoDepth();
  }

  static StandardGases: BreathingGas[];

  static GenerateStandardGases(settings: DiveSettingsService) {
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

  static getOptimalDecoGas(depth: number, settings: DiveSettingsService): BreathingGas {
    const atm = depth / 10 + 1;
    const oxygen = Math.min(100, Math.floor((settings.decoPO2Maximum * 100) / atm));

    let targetPN2 = (settings.ENDErrorThreshold / 10 + 1) * 79;

    if (settings.isOxygenNarcotic) {
      const targetNarcotic = (settings.ENDErrorThreshold / 10 + 1) * 100;
      targetPN2 = targetNarcotic - oxygen * atm;
    }

    let nitrogen = targetPN2 / atm;
    const helium = Math.max(0, Math.ceil(100 - oxygen - nitrogen));
    nitrogen = 100 - oxygen - helium;

    return BreathingGas.create(oxygen, helium, nitrogen, settings);
  }

  private calcDescription(): string {
    return `${this.Name} (${this.calcCompositionDescription()})`;
  }

  private calcCompositionDescription(): string {
    return `O<sub>2</sub>: ${this.Oxygen}%, He: ${this.Helium}%, N<sub>2</sub>: ${this.Nitrogen}%`;
  }

  private calcMaxDepthPO2(): number {
    return Math.floor((this._diveSettings.workingPO2Maximum * 1000) / this.Oxygen - 10);
  }

  private calcMaxDepthPO2Deco(): number {
    return Math.floor((this._diveSettings.decoPO2Maximum * 1000) / this.Oxygen - 10);
  }

  private calcMaxDepthEND(): number {
    if (this._diveSettings.isOxygenNarcotic) {
      return Math.floor(((this._diveSettings.ENDErrorThreshold + 10) * 100) / (this.Nitrogen + this.Oxygen) - 10);
    } else {
      return Math.floor((790 * ((this._diveSettings.ENDErrorThreshold + 10) / 10)) / this.Nitrogen - 10);
    }
  }

  private calcMinDepth(): number {
    return Math.max(0, Math.ceil((this._diveSettings.pO2Minimum * 1000) / this.Oxygen - 10));
  }

  private calcMaxDecoDepth(): number {
    return Math.min(this.calcMaxDepthPO2Deco(), this.calcMaxDepthEND());
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
}
