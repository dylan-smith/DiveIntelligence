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

  private constructor(name: string, oxygen: number, helium: number, nitrogen: number) {
    this.Name = name;
    this.Oxygen = oxygen;
    this.Helium = helium;
    this.Nitrogen = nitrogen;

    this.updateDetails();
  }

  static create(oxygen: number, helium: number, nitrogen: number): BreathingGas {
    const gas = new BreathingGas('Custom', oxygen, helium, nitrogen);

    const standardGas = BreathingGas.StandardGases.find(g => g.isEquivalent(gas));
    if (standardGas !== undefined) {
      return new BreathingGas(standardGas.Name, standardGas.Oxygen, standardGas.Helium, standardGas.Nitrogen);
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

  static StandardGases: BreathingGas[] = [
    new BreathingGas('Air', 21, 0, 79),
    new BreathingGas('Nitrox 32', 32, 0, 68),
    new BreathingGas('Oxygen', 100, 0, 0),
    new BreathingGas('Helitrox 25/25', 25, 25, 50),
    new BreathingGas('Helitrox 21/35', 21, 35, 44),
    new BreathingGas('Trimix 18/45', 18, 45, 37),
    new BreathingGas('Trimix 15/55', 15, 55, 30),
    new BreathingGas('Trimix 12/60', 12, 60, 28),
    new BreathingGas('Trimix 10/70', 10, 70, 20),
    new BreathingGas('Nitrox 50', 50, 0, 50),
    new BreathingGas('Helitrox 35/25', 35, 25, 40),
  ];

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
    return Math.floor(3950 / this.Nitrogen - 10);
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
    return Math.max(0, (this.getPN2(depth) / 0.79 - 1) * 10);
  }

  isEquivalent(other: BreathingGas): boolean {
    return this.Oxygen === other.Oxygen && this.Helium === other.Helium && this.Nitrogen === other.Nitrogen;
  }

  private getMaxDecoDepth(): number {
    return Math.min(this.getMaxDepthPO2Deco(), this.getMaxDepthEND());
  }
}
