import { ceilingWithThreshold } from '../utility/utility';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';

export class Tissue {
  private tissueByTime: Map<number, { PN2: number; PHe: number }> = new Map();
  private n2DeltaMultiplier: number = 0;
  private heDeltaMultiplier: number = 0;

  constructor(
    public tissueNumber: number,
    public n2HalfLife: number,
    public a_n2: number,
    public b_n2: number,
    public heHalfLife: number,
    public a_he: number,
    public b_he: number
  ) {
    this.tissueByTime.set(0, {
      PN2: this.ENVIRONMENT_PN2,
      PHe: this.ENVIRONMENT_PHE,
    });
    this.n2DeltaMultiplier = 1 - Math.pow(2, -(1 / (n2HalfLife * 60)));
    this.heDeltaMultiplier = 1 - Math.pow(2, -(1 / (heHalfLife * 60)));
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

      this.tissueByTime.set(t, {
        PN2: prevN2 + n2Delta,
        PHe: prevHe + heDelta,
      });
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

  getInstantCeiling(time: number): number {
    const result = (this.getMValue(time) - 1) * 10;
    return result < 0 ? 0 : result;
  }

  getTimeToInstantCeiling(depth: number, gas: BreathingGas): number | undefined {
    const ceiling = this.getInstantCeiling(this.tissueByTime.size - 1);

    if (ceiling > 0) {
      return 0;
    }

    const minCeiling = this.getInstantCeilingByPressures(gas.getPN2(depth), gas.getPHe(depth));

    if (minCeiling === 0 || isNaN(minCeiling)) {
      return undefined;
    }

    const pN2 = this.getPN2(this.tissueByTime.size - 1);
    const pHe = this.getPHe(this.tissueByTime.size - 1);

    let minNDL = 0;
    let maxNDL = this.MAX_NDL;
    let time = (maxNDL - minNDL) / 2;

    while (minNDL < maxNDL) {
      const newPN2 = pN2 + this.getPN2DeltaByTime(pN2, gas.getPN2(depth), time);
      const newPHe = pHe + this.getPHeDeltaByTime(pHe, gas.getPHe(depth), time);
      const newCeiling = this.getInstantCeilingByPressures(newPN2, newPHe);

      if (newCeiling <= 0) {
        minNDL = time;
      } else {
        maxNDL = time - 1;
      }

      time = ceilingWithThreshold((maxNDL - minNDL) / 2) + minNDL;
    }

    if (time >= this.MAX_NDL) {
      return undefined;
    }

    return Math.floor(time);
  }

  getPN2(time: number): number {
    return this.getTissueByTime(time).PN2;
  }

  getPHe(time: number): number {
    return this.getTissueByTime(time).PHe;
  }

  private getInstantCeilingByPressures(pN2: number, pHe: number): number {
    const result = (this.getMValueByPressures(pN2, pHe) - 1) * 10;
    return result < 0 ? 0 : result;
  }

  private getTissueByTime(time: number): { PN2: number; PHe: number } {
    return this.tissueByTime.get(time) ?? { PN2: this.ENVIRONMENT_PN2, PHe: this.ENVIRONMENT_PHE };
  }

  private getPN2Delta(tissuePN2: number, gasPN2: number): number {
    return this.getTissueDelta(tissuePN2, gasPN2, this.n2DeltaMultiplier);
  }

  private getPN2DeltaByTime(tissuePN2: number, gasPN2: number, time: number): number {
    return this.getTissueDeltaByTime(tissuePN2, gasPN2, this.n2HalfLife, time);
  }

  private getPHeDelta(tissuePHe: number, gasPHe: number): number {
    return this.getTissueDelta(tissuePHe, gasPHe, this.heDeltaMultiplier);
  }

  private getPHeDeltaByTime(tissuePHe: number, gasPHe: number, time: number): number {
    return this.getTissueDeltaByTime(tissuePHe, gasPHe, this.heHalfLife, time);
  }

  private getTissueDelta(tissuePartialPressure: number, gasPartialPressure: number, deltaMultiplier: number): number {
    return (gasPartialPressure - tissuePartialPressure) * deltaMultiplier;
  }

  private getTissueDeltaByTime(tissuePartialPressure: number, gasPartialPressure: number, halflife: number, time: number): number {
    return (gasPartialPressure - tissuePartialPressure) * (1 - Math.pow(2, -(time / (halflife * 60))));
  }

  private getAByPressures(pN2: number, pHe: number): number {
    return (pN2 * this.a_n2 + pHe * this.a_he) / (pN2 + pHe);
  }

  private getBByPressures(pN2: number, pHe: number): number {
    return (pN2 * this.b_n2 + pHe * this.b_he) / (pN2 + pHe);
  }

  private getMValue(time: number): number {
    return this.getMValueByPressures(this.getPN2(time), this.getPHe(time));
  }

  private getMValueByPressures(pN2: number, pHe: number): number {
    return (pN2 + pHe - this.getAByPressures(pN2, pHe)) * this.getBByPressures(pN2, pHe);
  }
}
