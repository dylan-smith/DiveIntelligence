import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSettingsService } from './DiveSettings.service';
import { Tissue } from './Tissue';

export class BuhlmannZHL16C {
  private tissues: Tissue[] = [];

  constructor(private diveSettings: DiveSettingsService) {
    this.tissues.push(new Tissue(1, 5, 1.1696, 0.5578, 1.51, 1.7474, 0.4245, diveSettings.GFLow));
    this.tissues.push(new Tissue(2, 8, 1.0, 0.6514, 3.02, 1.383, 0.5747, diveSettings.GFLow));
    this.tissues.push(new Tissue(3, 12.5, 0.8618, 0.7222, 4.72, 1.1919, 0.6257, diveSettings.GFLow));
    this.tissues.push(new Tissue(4, 18.5, 0.7562, 0.7825, 6.99, 1.0458, 0.7223, diveSettings.GFLow));
    this.tissues.push(new Tissue(5, 27, 0.62, 0.8126, 10.21, 0.922, 0.7582, diveSettings.GFLow));
    this.tissues.push(new Tissue(6, 38.3, 0.5043, 0.8434, 14.48, 0.8205, 0.7957, diveSettings.GFLow));
    this.tissues.push(new Tissue(7, 54.3, 0.441, 0.8693, 20.53, 0.7305, 0.8279, diveSettings.GFLow));
    this.tissues.push(new Tissue(8, 77, 0.4, 0.891, 29.11, 0.6502, 0.8553, diveSettings.GFLow));
    this.tissues.push(new Tissue(9, 109, 0.375, 0.9092, 41.2, 0.595, 0.8757, diveSettings.GFLow));
    this.tissues.push(new Tissue(10, 146, 0.35, 0.9222, 55.19, 0.5545, 0.8903, diveSettings.GFLow));
    this.tissues.push(new Tissue(11, 187, 0.3295, 0.9319, 70.69, 0.5333, 0.8997, diveSettings.GFLow));
    this.tissues.push(new Tissue(12, 239, 0.3065, 0.9403, 90.34, 0.5189, 0.9073, diveSettings.GFLow));
    this.tissues.push(new Tissue(13, 305, 0.2835, 0.9477, 115.29, 0.5181, 0.9122, diveSettings.GFLow));
    this.tissues.push(new Tissue(14, 390, 0.261, 0.9544, 147.42, 0.5176, 0.9171, diveSettings.GFLow));
    this.tissues.push(new Tissue(15, 498, 0.248, 0.9602, 188.24, 0.5172, 0.9217, diveSettings.GFLow));
    this.tissues.push(new Tissue(16, 635, 0.2327, 0.9653, 240.03, 0.5119, 0.9267, diveSettings.GFLow));
  }

  // TODO: subscribe to diveSettings changes and rebuild the tissues. should probably check other classes that depend on diveSettings too

  clone(): BuhlmannZHL16C {
    const result = new BuhlmannZHL16C(this.diveSettings);
    result.tissues = this.tissues.map(t => t.clone());
    return result;
  }

  discardAfterTime(time: number) {
    this.tissues.forEach(t => t.discardAfterTime(time));
  }

  calculateForSegment(segment: DiveSegment) {
    this.tissues.forEach(t => t.calculateForSegment(segment));
  }

  getInstantCeiling(time: number, depth: number): number {
    const targetGF = this.calculateTargetGF(this.getDeepestCeiling(), depth, this.diveSettings.GFLow, this.diveSettings.GFHigh);
    return Math.max(...this.tissues.map(t => t.getInstantCeiling(time, targetGF)));
  }

  getTimeToInstantCeiling(depth: number, gas: BreathingGas): number | undefined {
    const targetGF = this.calculateTargetGF(this.getDeepestCeiling(), depth, this.diveSettings.GFLow, this.diveSettings.GFHigh);
    const tissueNdls = this.tissues.map(t => t.getTimeToInstantCeiling(depth, gas, targetGF));
    const validNdls = tissueNdls.filter(x => x !== undefined) as number[];

    if (validNdls.length === 0) return undefined;

    return Math.min(...validNdls);
  }

  private calculateTargetGF(deepestCeiling: number, depth: number, gfLow: number, gfHigh: number): number {
    if (depth >= deepestCeiling) return gfLow;

    const percent = (deepestCeiling - depth) / deepestCeiling;
    return gfLow + (gfHigh - gfLow) * percent;
  }

  private getDeepestCeiling(): number {
    return Math.max(...this.tissues.map(t => t.getDeepestCeiling()));
  }

  getTissueInstantCeiling(time: number, tissue: number, depth: number): number {
    return this.tissues[tissue - 1].getInstantCeiling(time, depth);
  }

  getTissuePN2(time: number, tissue: number): number {
    return this.tissues[tissue - 1].getPN2(time);
  }

  getTissuePHe(time: number, tissue: number): number {
    return this.tissues[tissue - 1].getPHe(time);
  }
}
