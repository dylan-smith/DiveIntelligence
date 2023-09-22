export class BreathingGas {
  Name: string;
  Oxygen: number;
  Helium: number;
  Nitrogen: number;

  constructor(name: string, oxygen: number, helium: number, nitrogen: number) {
    this.Name = name;
    this.Oxygen = oxygen;
    this.Helium = helium;
    this.Nitrogen = nitrogen;
  }

  getDescription(): string {
    return `${this.Name} (${this.getCompositionDescription()})`;
  }

  getCompositionDescription(): string {
    return `O<sub>2</sub>: ${this.Oxygen}%, He: ${this.Helium}%, N<sub>2</sub>: ${this.Nitrogen}%`;
  }

  getMaxDepthPO2(): number {
    return Math.floor(1400 / this.Oxygen - 10);
  }

  getMaxDepthPO2Deco(): number {
    return Math.floor(1600 / this.Oxygen - 10);
  }

  getMaxDepthEND(): number {
    return Math.floor(3950 / this.Nitrogen - 10);
  }

  getMinDepth(): number {
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
}
