import { TestBed } from '@angular/core/testing';
import { DivePlannerService } from './DivePlannerService';
import { DiveSettingsService } from './DiveSettings.service';
import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';
import { HumanDurationPipe } from '../pipes/human-duration.pipe';
import { BreathingGas } from './BreathingGas';
import { ChartGeneratorService } from './ChartGenerator.service';
import { ApplicationInsightsService } from '../application-insights-service/application-insights.service';

describe('DivePlannerService', () => {
  let svc: DivePlannerService;
  let diveSettingsService: DiveSettingsService;

  beforeEach(() => {
    const mockAppInsights = jasmine.createSpyObj('ApplicationInsightsService', ['trackEvent', 'trackTrace']);

    TestBed.configureTestingModule({
      providers: [
        DivePlannerService,
        DiveSettingsService,
        DiveSegmentFactoryService,
        ChartGeneratorService,
        HumanDurationPipe,
        { provide: ApplicationInsightsService, useValue: mockAppInsights },
      ],
    });

    svc = TestBed.inject(DivePlannerService);
    diveSettingsService = TestBed.inject(DiveSettingsService);
  });

  it('with no segments on air', () => {
    const startGas = svc.getStandardGases()[0]; // Air
    svc.startDive(startGas);

    expect(svc.getCurrentDepth()).toBe(0);
    expect(svc.getCurrentCeiling()).toBe(0);
    expect(svc.getCurrentGas()).toBe(startGas);
    expect(svc.getCurrentGas().maxDepthPO2).toBe(56);
    expect(svc.getCurrentGas().maxDepthPO2Deco).toBe(66);
    expect(svc.getCurrentGas().maxDepthEND).toBe(30);
    expect(svc.getCurrentGas().maxDecoDepth).toBe(30);
    expect(svc.getCurrentGas().minDepth).toBe(0);
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
    const nitrox32 = svc.getStandardGases().filter(gas => gas.name === 'Nitrox 32')[0];
    const air = svc.getStandardGases().filter(gas => gas.name === 'Air')[0];

    svc.startDive(nitrox32);
    svc.addChangeDepthSegment(30);
    svc.addMaintainDepthSegment(25 * 60);

    expect(svc.getCurrentDepth()).toBe(30);
    expect(svc.getCurrentCeiling()).toBe(0);
    expect(svc.getCurrentGas()).toBe(nitrox32);
    expect(svc.getCurrentGas().maxDepthPO2).toBe(33);
    expect(svc.getCurrentGas().maxDepthPO2Deco).toBe(40);
    expect(svc.getCurrentGas().maxDepthEND).toBe(30);
    expect(svc.getCurrentGas().maxDecoDepth).toBe(30);
    expect(svc.getCurrentGas().minDepth).toBe(0);
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

    expect(svc.getNoDecoLimit(25, air, 0)).toBe(518);
    expect(svc.getOptimalDecoGas(25).oxygen).toBe(45);
    expect(svc.getOptimalDecoGas(25).helium).toBe(0);
    expect(svc.getOptimalDecoGas(25).nitrogen).toBe(55);

    expect(svc.getTravelTime(53)).toBe(69);
    expect(svc.getTravelTime(12)).toBe(108);

    expect(svc.getNewInstantCeiling(30, 42 * 60)).toBe(4);
  });

  it('deco dive breaking the limits', () => {
    const trimix1555 = svc.getStandardGases().filter(gas => gas.oxygen === 15 && gas.helium === 55)[0];
    const trimix1070 = svc.getStandardGases().filter(gas => gas.oxygen === 10 && gas.helium === 70)[0];
    const nitrox50 = svc.getStandardGases().filter(gas => gas.oxygen === 50 && gas.helium === 0)[0];
    const custom3030 = BreathingGas.create(30, 30, 40, diveSettingsService);
    const oxygen = svc.getStandardGases().filter(gas => gas.oxygen === 100)[0];

    svc.startDive(trimix1555);
    svc.addChangeDepthSegment(50);
    svc.addChangeGasSegment(trimix1070);
    svc.addMaintainDepthSegment(1 * 60);
    svc.addChangeDepthSegment(100);
    svc.addMaintainDepthSegment(30 * 60);
    svc.addChangeDepthSegment(40);
    svc.addChangeGasSegment(nitrox50);
    svc.addMaintainDepthSegment(10 * 60);
    svc.addChangeDepthSegment(20);
    svc.addChangeGasSegment(custom3030);
    svc.addMaintainDepthSegment(60 * 60);
    svc.addChangeDepthSegment(6);
    svc.addChangeGasSegment(oxygen);
    svc.addMaintainDepthSegment(35 * 60);

    expect(svc.getCurrentDepth()).toBe(6);
    expect(svc.getCurrentInstantCeiling()).toBe(1);
    expect(svc.getCurrentCeiling()).toBe(0);
    expect(svc.getCurrentGas()).toBe(oxygen);
    expect(svc.getCurrentGas().maxDepthPO2).toBe(4);
    expect(svc.getCurrentGas().maxDepthPO2Deco).toBe(6);
    expect(svc.getCurrentGas().maxDepthEND).toBe(30);
    expect(svc.getCurrentGas().maxDecoDepth).toBe(6);
    expect(svc.getCurrentGas().minDepth).toBe(0);
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

  it('NDL accounts for on-gassing during ascent', () => {
    const air = svc.getStandardGases().filter(gas => gas.oxygen === 21 && gas.helium === 0)[0];

    svc.startDive(air);

    expect(svc.getNoDecoLimit(105, air, 0)).toBe(0);
  });
});
