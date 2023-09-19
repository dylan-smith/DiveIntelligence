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
}
