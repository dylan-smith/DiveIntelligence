import { Injectable } from '@angular/core';
import { StandardGases } from './StandardGases';
import { BreathingGas } from './BreathingGas';
import { DiveSegment } from './DiveSegment';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { DiveProfile } from './DiveProfile';
import { BuhlmannZHL16C } from './BuhlmannZHL16C';

@Injectable({
  providedIn: 'root',
})
export class DivePlannerService {
  public diveProfile: DiveProfile = new DiveProfile();

  constructor(private diveSegmentFactory: DiveSegmentFactoryService) {}

  private DESCENT_RATE = 3; // seconds per meter
  private ASCENT_RATE = 6; // seconds per meter

  getStandardGases(): BreathingGas[] {
    return StandardGases;
  }

  startDive(startGas: BreathingGas) {
    this.diveProfile.addSegment(this.diveSegmentFactory.createStartDiveSegment(startGas));
    this.diveProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(0, 0, startGas));
  }

  getDiveSegments(): DiveSegment[] {
    return this.diveProfile.segments;
  }

  getDiveDuration(): number {
    return this.diveProfile.getTotalTime();
  }

  getMaxDepth(): number {
    return this.diveProfile.getMaxDepth();
  }

  getAverageDepth(): number {
    return this.diveProfile.getAverageDepth();
  }

  getPreviousSegment(): DiveSegment {
    return this.diveProfile.segments[this.diveProfile.segments.length - 2];
  }

  getCurrentDepth(): number {
    return this.getPreviousSegment().EndDepth;
  }

  getOptimalDecoGas(depth: number): BreathingGas {
    const atm = depth / 10 + 1;
    const oxygen = Math.min(100, Math.floor(160 / atm));

    const targetPN2 = 5 * 0.79;
    let nitrogen = (targetPN2 / atm) * 100;
    const helium = Math.max(0, Math.ceil(100 - oxygen - nitrogen));
    nitrogen = 100 - oxygen - helium;

    return new BreathingGas('Custom', oxygen, helium, nitrogen);
  }

  getCurrentCeiling(): number {
    const currentTime = this.getPreviousSegment().EndTimestamp;

    return Math.ceil(new BuhlmannZHL16C(this.diveProfile).getCeiling(currentTime));
  }

  getCurrentGas(): BreathingGas {
    return this.getPreviousSegment().Gas;
  }

  getNoDecoLimit(newDepth: number, newGas: BreathingGas): number {
    // TODO: implement
    return 632 + newDepth + newGas.Oxygen;
  }

  addDiveSegment(newDepth: number, newGas: BreathingGas, timeAtDepth: number): void {
    // remove the final surface segment, will re-add it later
    this.diveProfile.removeLastSegment();

    let previousSegment = this.diveProfile.segments[this.diveProfile.segments.length - 1];
    let startTime = previousSegment.EndTimestamp;

    if (newDepth === previousSegment.EndDepth && previousSegment.Gas.isEquivalent(newGas) && timeAtDepth > 0) {
      this.diveProfile.extendLastSegment(timeAtDepth);
    }

    if (newDepth !== previousSegment.EndDepth) {
      if (previousSegment.Gas.isEquivalent(newGas)) {
        this.diveProfile.addSegment(
          this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, timeAtDepth, previousSegment.Gas)
        );
      } else {
        this.diveProfile.addSegment(this.diveSegmentFactory.createDepthChangeSegment(startTime, previousSegment.EndDepth, newDepth, 0, previousSegment.Gas));
      }
    }

    previousSegment = this.diveProfile.segments[this.diveProfile.segments.length - 1];
    startTime = previousSegment.EndTimestamp;

    if (!previousSegment.Gas.isEquivalent(newGas)) {
      this.diveProfile.addSegment(this.diveSegmentFactory.createGasChangeSegment(startTime, newGas, timeAtDepth, newDepth));
    }

    const endTime = this.diveProfile.segments[this.diveProfile.segments.length - 1].EndTimestamp;

    this.diveProfile.addSegment(this.diveSegmentFactory.createEndDiveSegment(endTime, newDepth, newGas));
  }

  getDescentDuration(newDepth: number): number | undefined {
    if (newDepth > this.getCurrentDepth()) {
      return (newDepth - this.getCurrentDepth()) * this.DESCENT_RATE;
    }

    return undefined;
  }

  getAscentDuration(newDepth: number): number | undefined {
    if (newDepth < this.getCurrentDepth()) {
      return (this.getCurrentDepth() - newDepth) * this.ASCENT_RATE;
    }

    return undefined;
  }
}
