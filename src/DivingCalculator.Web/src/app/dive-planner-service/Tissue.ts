import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';

export class Tissue {
  private tissueByTime: Map<number, { PN2: number; PHe: number }> = new Map();

  constructor(
    public tissueNumber: number,
    public n2HalfLife: number,
    public a_n2: number,
    public b_n2: number,
    public heHalfLife: number,
    public a_he: number,
    public b_he: number
  ) {
    this.tissueByTime.set(0, { PN2: this.ENVIRONMENT_PN2, PHe: this.ENVIRONMENT_PHE });
  }

  readonly ENVIRONMENT_PN2 = 0.79;
  readonly ENVIRONMENT_PHE = 0.0;
  readonly MAX_NDL = 3600 * 5;

  calculateForSegment(segment: DiveSegment) {
    for (let t = segment.StartTimestamp; t <= segment.EndTimestamp; t++) {
      const prevN2 = this.getTissueByTime(t - 1).PN2;
      const gasN2 = segment.Gas.getPN2(segment.getDepth(t));
      const n2Delta = this.getPN2Delta(prevN2, gasN2);

      const prevHe = this.getTissueByTime(t - 1).PHe;
      const gasHe = segment.Gas.getPHe(segment.getDepth(t));
      const heDelta = this.getPHeDelta(prevHe, gasHe);

      this.tissueByTime.set(t, { PN2: prevN2 + n2Delta, PHe: prevHe + heDelta });
    }
  }

  discardAfterTime(time: number) {
    this.tissueByTime = new Map(Array.from(this.tissueByTime.entries()).filter(([key]) => key <= time));
  }

  clone(): Tissue {
    const clone = new Tissue(this.tissueNumber, this.n2HalfLife, this.a_n2, this.b_n2, this.heHalfLife, this.a_he, this.b_he);
    clone.tissueByTime = new Map(this.tissueByTime);
    return clone;
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
    return this.getAByPressures(this.getPN2(time), this.getPHe(time));
  }

  getAByPressures(pN2: number, pHe: number): number {
    return (pN2 * this.a_n2 + pHe * this.a_he) / (pN2 + pHe);
  }

  getB(time: number): number {
    return this.getBByPressures(this.getPN2(time), this.getPHe(time));
  }

  getBByPressures(pN2: number, pHe: number): number {
    return (pN2 * this.b_n2 + pHe * this.b_he) / (pN2 + pHe);
  }

  getMValue(time: number): number {
    return this.getMValueByPressures(this.getPN2(time), this.getPHe(time));
  }

  getMValueByPressures(pN2: number, pHe: number): number {
    return (pN2 + pHe - this.getAByPressures(pN2, pHe)) * this.getBByPressures(pN2, pHe);
  }

  getCeiling(time: number): number {
    const result = (this.getMValue(time) - 1) * 10;
    return result < 0 ? 0 : result;
  }

  getCeilingByPressures(pN2: number, pHe: number): number {
    const result = (this.getMValueByPressures(pN2, pHe) - 1) * 10;
    return result < 0 ? 0 : result;
  }

  getNoDecoLimit(depth: number, gas: BreathingGas): number | undefined {
    let ceiling = this.getCeiling(this.tissueByTime.size - 1);

    if (ceiling > 0) {
      return 0;
    }

    const minCeiling = this.getCeilingByPressures(gas.getPN2(depth), gas.getPHe(depth));

    if (minCeiling === 0) {
      return undefined;
    }

    let time = 0;
    let pN2 = this.getPN2(this.tissueByTime.size - 1);
    let pHe = this.getPHe(this.tissueByTime.size - 1);

    while (ceiling <= 0 && time < this.MAX_NDL) {
      time += 1;

      pN2 += this.getPN2Delta(pN2, gas.getPN2(depth));
      pHe += this.getPHeDelta(pHe, gas.getPHe(depth));
      ceiling = this.getCeilingByPressures(pN2, pHe);
    }

    if (time >= this.MAX_NDL) {
      return undefined;
    }

    return time;
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
