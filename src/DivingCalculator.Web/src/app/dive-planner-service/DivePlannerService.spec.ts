import { TestBed } from '@angular/core/testing';
import { DivePlannerService } from './DivePlannerService';
import { DiveSettingsService } from './DiveSettings.service';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { BreathingGas } from './BreathingGas';

describe('DivePlannerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [DivePlannerService],
    })
  );

  it('with no segments on air', () => {
    const diveSettingsService = new DiveSettingsService();
    const mockAppInsights = jasmine.createSpyObj('ApplicationInsightsService', ['trackEvent', 'trackTrace']);
    const diveSegmentFactory = new DiveSegmentFactoryService(new HumanDurationPipe(), diveSettingsService);
    const svc = new DivePlannerService(diveSegmentFactory, mockAppInsights, diveSettingsService);

    const startGas = svc.getStandardGases()[0]; // Air
    svc.startDive(startGas);

    expect(svc.getCurrentDepth()).toBe(0);
    expect(svc.getCurrentCeiling()).toBe(0);
    expect(svc.getCurrentGas()).toBe(startGas);
    expect(svc.getCurrentGas().MaxDepthPO2).toBe(56);
    expect(svc.getCurrentGas().MaxDepthPO2Deco).toBe(66);
    expect(svc.getCurrentGas().MaxDepthEND).toBe(30);
    expect(svc.getCurrentGas().MaxDecoDepth).toBe(30);
    expect(svc.getCurrentGas().MinDepth).toBe(0);
    expect(svc.getCurrentGas().getEND(svc.getCurrentDepth())).toBe(0);
    expect(svc.getCurrentGas().getPO2(svc.getCurrentDepth())).toBe(0.21);
    expect(svc.getCurrentGas().getPN2(svc.getCurrentDepth())).toBe(0.79);
    expect(svc.getCurrentGas().getPHe(svc.getCurrentDepth())).toBe(0);
    expect(svc.getAverageDepth()).toBe(0);
    expect(svc.getDiveDuration()).toBe(0);
    expect(svc.getCeilingError().duration).toBe(0);
    expect(svc.getENDError().duration).toBe(0);
    expect(svc.getHypoxicError().duration).toBe(0);
    expect(svc.getMaxDepth()).toBe(0);
    expect(svc.getPO2Error().duration).toBe(0);
  });

  it('30m for 25 mins on nitrox 32', () => {
    const diveSettingsService = new DiveSettingsService();
    const mockAppInsights = jasmine.createSpyObj('ApplicationInsightsService', ['trackEvent', 'trackTrace']);
    const diveSegmentFactory = new DiveSegmentFactoryService(new HumanDurationPipe(), diveSettingsService);
    const svc = new DivePlannerService(diveSegmentFactory, mockAppInsights, diveSettingsService);

    const nitrox32 = svc.getStandardGases().filter(gas => gas.Name === 'Nitrox 32')[0];
    const air = svc.getStandardGases().filter(gas => gas.Name === 'Air')[0];

    svc.startDive(nitrox32);
    svc.addDiveSegment(30, nitrox32, 25 * 60);

    expect(svc.getCurrentDepth()).toBe(30);
    expect(svc.getCurrentCeiling()).toBe(0);
    expect(svc.getCurrentGas()).toBe(nitrox32);
    expect(svc.getCurrentGas().MaxDepthPO2).toBe(33);
    expect(svc.getCurrentGas().MaxDepthPO2Deco).toBe(40);
    expect(svc.getCurrentGas().MaxDepthEND).toBe(30);
    expect(svc.getCurrentGas().MaxDecoDepth).toBe(30);
    expect(svc.getCurrentGas().MinDepth).toBe(0);
    expect(svc.getCurrentGas().getEND(svc.getCurrentDepth())).toBe(30);
    expect(svc.getCurrentGas().getPO2(svc.getCurrentDepth())).toBe(1.28);
    expect(svc.getCurrentGas().getPN2(svc.getCurrentDepth())).toBe(2.72);
    expect(svc.getCurrentGas().getPHe(svc.getCurrentDepth())).toBe(0);
    expect(Math.round(svc.getAverageDepth())).toBe(28);
    expect(svc.getDiveDuration()).toBe(1770);
    expect(svc.getCeilingError().duration).toBe(0);
    expect(svc.getENDError().duration).toBe(0);
    expect(svc.getHypoxicError().duration).toBe(0);
    expect(svc.getMaxDepth()).toBe(30);
    expect(svc.getPO2Error().duration).toBe(0);

    expect(svc.getNoDecoLimit(25, air)).toBe(518);
    expect(svc.getOptimalDecoGas(25).Oxygen).toBe(45);
    expect(svc.getOptimalDecoGas(25).Helium).toBe(0);
    expect(svc.getOptimalDecoGas(25).Nitrogen).toBe(55);

    expect(svc.getTravelTime(53)).toBe(69);
    expect(svc.getTravelTime(12)).toBe(108);

    expect(svc.getNewCeiling(53, air, 42 * 60)).toBe(18);
  });

  it('deco dive breaking the limits', () => {
    const diveSettingsService = new DiveSettingsService();
    const mockAppInsights = jasmine.createSpyObj('ApplicationInsightsService', ['trackEvent', 'trackTrace']);
    const diveSegmentFactory = new DiveSegmentFactoryService(new HumanDurationPipe(), diveSettingsService);
    const svc = new DivePlannerService(diveSegmentFactory, mockAppInsights, diveSettingsService);

    const trimix1555 = svc.getStandardGases().filter(gas => gas.Oxygen === 15 && gas.Helium === 55)[0];
    const trimix1070 = svc.getStandardGases().filter(gas => gas.Oxygen === 10 && gas.Helium === 70)[0];
    const nitrox50 = svc.getStandardGases().filter(gas => gas.Oxygen === 50 && gas.Helium === 0)[0];
    const custom3030 = BreathingGas.create(30, 30, 40, diveSettingsService);
    const oxygen = svc.getStandardGases().filter(gas => gas.Oxygen === 100)[0];

    svc.startDive(trimix1555);
    svc.addDiveSegment(50, trimix1070, 1 * 60);
    svc.addDiveSegment(100, trimix1070, 30 * 60);
    svc.addDiveSegment(40, nitrox50, 10 * 60);
    svc.addDiveSegment(20, custom3030, 60 * 60);
    svc.addDiveSegment(6, oxygen, 35 * 60);

    expect(svc.getCurrentDepth()).toBe(6);
    expect(svc.getCurrentCeiling()).toBe(1);
    expect(svc.getCurrentGas()).toBe(oxygen);
    expect(svc.getCurrentGas().MaxDepthPO2).toBe(4);
    expect(svc.getCurrentGas().MaxDepthPO2Deco).toBe(6);
    expect(svc.getCurrentGas().MaxDepthEND).toBe(30);
    expect(svc.getCurrentGas().MaxDecoDepth).toBe(6);
    expect(svc.getCurrentGas().MinDepth).toBe(0);
    expect(Math.round(svc.getCurrentGas().getEND(svc.getCurrentDepth()))).toBe(6);
    expect(svc.getCurrentGas().getPO2(svc.getCurrentDepth())).toBe(1.6);
    expect(svc.getCurrentGas().getPN2(svc.getCurrentDepth())).toBe(0);
    expect(svc.getCurrentGas().getPHe(svc.getCurrentDepth())).toBe(0);
    expect(Math.round(svc.getAverageDepth())).toBe(37);
    expect(svc.getDiveDuration()).toBe(9060);
    expect(svc.getCeilingError().duration).toBe(453);
    expect(svc.getENDError().duration).toBe(660);
    expect(svc.getHypoxicError().duration).toBe(6);
    expect(svc.getMaxDepth()).toBe(100);
    expect(svc.getPO2Error().duration).toBe(708);
  });
});
