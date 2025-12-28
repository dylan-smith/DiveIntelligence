import { ceilingWithThreshold, floorWithThreshold } from '../utils/utility';
import { DiveSettingsService } from './DiveSettings.service';

export class BreathingGas {
  description!: string;
  compositionDescription!: string;
  maxDepthPO2!: number;
  maxDepthPO2Deco!: number;
  maxDepthEND!: number;
  minDepth!: number;
  maxDecoDepth!: number;

  private constructor(
    public name: string,
    public oxygen: number,
    public helium: number,
    public nitrogen: number,
    private diveSettings: DiveSettingsService
  ) {
    this.diveSettings.subscribeToChanges(() => this.onDiveSettingsChanged());

    this.updateDetails();
  }

  onDiveSettingsChanged(): void {
    this.updateDetails();
  }

  static create(oxygen: number, helium: number, nitrogen: number, settings: DiveSettingsService): BreathingGas {
    const gas = new BreathingGas('Custom', oxygen, helium, nitrogen, settings);

    const standardGas = BreathingGas.StandardGases.find(g => g.isEquivalent(gas));
    if (standardGas !== undefined) {
      return new BreathingGas(standardGas.name, standardGas.oxygen, standardGas.helium, standardGas.nitrogen, settings);
    }

    return gas;
  }

  updateDetails(): void {
    this.description = this.calcDescription();
    this.compositionDescription = this.calcCompositionDescription();
    this.maxDepthPO2 = this.calcMaxDepthPO2();
    this.maxDepthPO2Deco = this.calcMaxDepthPO2Deco();
    this.maxDepthEND = this.calcMaxDepthEND();
    this.minDepth = this.calcMinDepth();
    this.maxDecoDepth = this.calcMaxDecoDepth();
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
    const oxygen = Math.min(100, floorWithThreshold((settings.decoPO2Maximum * 100) / atm));

    let targetPN2 = (settings.ENDErrorThreshold / 10 + 1) * 79;

    if (settings.isOxygenNarcotic) {
      const targetNarcotic = (settings.ENDErrorThreshold / 10 + 1) * 100;
      targetPN2 = targetNarcotic - oxygen * atm;
    }

    let nitrogen = targetPN2 / atm;
    const helium = Math.max(0, ceilingWithThreshold(100 - oxygen - nitrogen));
    nitrogen = 100 - oxygen - helium;

    return BreathingGas.create(oxygen, helium, nitrogen, settings);
  }

  private calcDescription(): string {
    return `${this.name} (${this.calcCompositionDescription()})`;
  }

  private calcCompositionDescription(): string {
    return `O<sub>2</sub>: ${this.oxygen}%, He: ${this.helium}%, N<sub>2</sub>: ${this.nitrogen}%`;
  }

  private calcMaxDepthPO2(): number {
    return Math.floor((this.diveSettings.workingPO2Maximum * 1000) / this.oxygen - 10);
  }

  private calcMaxDepthPO2Deco(): number {
    return Math.floor((this.diveSettings.decoPO2Maximum * 1000) / this.oxygen - 10);
  }

  private calcMaxDepthEND(): number {
    if (this.diveSettings.isOxygenNarcotic) {
      return Math.floor(((this.diveSettings.ENDErrorThreshold + 10) * 100) / (this.nitrogen + this.oxygen) - 10);
    } else {
      return Math.floor((790 * ((this.diveSettings.ENDErrorThreshold + 10) / 10)) / this.nitrogen - 10);
    }
  }

  private calcMinDepth(): number {
    return Math.max(0, ceilingWithThreshold((this.diveSettings.pO2Minimum * 1000) / this.oxygen - 10));
  }

  private calcMaxDecoDepth(): number {
    return Math.min(this.calcMaxDepthPO2Deco(), this.calcMaxDepthEND());
  }

  getPO2(depth: number): number {
    return (depth / 10 + 1) * (this.oxygen / 100);
  }

  getPHe(depth: number): number {
    return (depth / 10 + 1) * (this.helium / 100);
  }

  getPN2(depth: number): number {
    return (depth / 10 + 1) * (this.nitrogen / 100);
  }

  getEND(depth: number): number {
    if (this.diveSettings.isOxygenNarcotic) {
      return Math.max(0, (this.getPN2(depth) + this.getPO2(depth) - 1) * 10);
    }

    return Math.max(0, (this.getPN2(depth) / 0.79 - 1) * 10);
  }

  isEquivalent(other: BreathingGas): boolean {
    return this.oxygen === other.oxygen && this.helium === other.helium && this.nitrogen === other.nitrogen;
  }
}
