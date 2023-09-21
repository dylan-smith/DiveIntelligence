import { DiveProfile } from './DiveProfile';

export class Tissue {
  private tissueByTime: Map<number, { PN2: number; PHe: number }> = new Map();

  constructor(
    public tissueNumber: number,
    public n2HalfLife: number,
    public a_n2: number,
    public b_n2: number,
    public heHalfLife: number,
    public a_he: number,
    public b_he: number,
    profile: DiveProfile
  ) {
    this.applyDiveProfile(profile);
  }

  readonly ENVIRONMENT_PN2 = 0.79;
  readonly ENVIRONMENT_PHE = 0.0;

  private applyDiveProfile(profile: DiveProfile): void {
    this.tissueByTime.clear();
    this.tissueByTime.set(0, { PN2: this.ENVIRONMENT_PN2, PHe: this.ENVIRONMENT_PHE });

    for (let t = 1; t <= profile.getTotalTime(); t++) {
      const prevN2 = this.getTissueByTime(t - 1).PN2;
      const gasN2 = profile.getGas(t).getPN2(profile.getDepth(t));
      const n2Delta = this.getPN2Delta(prevN2, gasN2);

      const prevHe = this.getTissueByTime(t - 1).PHe;
      const gasHe = profile.getGas(t).getPHe(profile.getDepth(t));
      const heDelta = this.getPHeDelta(prevHe, gasHe);

      this.tissueByTime.set(t, { PN2: prevN2 + n2Delta, PHe: prevHe + heDelta });
    }
  }

  getTissueByTime(time: number): { PN2: number; PHe: number } {
    return this.tissueByTime.get(time) ?? { PN2: 0, PHe: 0 };
  }

  getPN2Delta(tissuePN2: number, gasPN2: number): number {
    return this.getTissueDelta(tissuePN2, gasPN2, this.n2HalfLife);
  }

  getPHeDelta(tissuePHe: number, gasPHe: number): number {
    return this.getTissueDelta(tissuePHe, gasPHe, this.heHalfLife);
  }

  getTissueDelta(tissuePartialPressure: number, gasPartialPressure: number, halfLife: number): number {
    return (gasPartialPressure - tissuePartialPressure) * (1 - Math.pow(2, -(1 / (halfLife * 60))));
  }

  getA(time: number): number {
    return (this.getPN2(time) * this.a_n2 + this.getPHe(time) * this.a_he) / this.getPTotal(time);
  }

  getB(time: number): number {
    return (this.getPN2(time) * this.b_n2 + this.getPHe(time) * this.b_he) / this.getPTotal(time);
  }

  getMValue(time: number): number {
    return (this.getPTotal(time) - this.getA(time)) * this.getB(time);
  }

  getCeiling(time: number): number {
    const result = (this.getMValue(time) - 1) * 10;
    return result < 0 ? 0 : result;
  }

  getPN2(time: number): number {
    return this.getTissueByTime(time).PN2;
  }

  getPHe(time: number): number {
    return this.getTissueByTime(time).PHe;
  }

  getPTotal(time: number): number {
    return this.getPN2(time) + this.getPHe(time);
  }
}
