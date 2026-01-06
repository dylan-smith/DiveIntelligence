import { DivePlannerService } from './DivePlannerService';
import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';

describe('DivePlannerService', () => {
  let svc: DivePlannerService;

  beforeEach(() => {
    svc = new DivePlannerService();
  });

  it('with no segments on air', () => {
    const startGas = svc.getStandardGases()[0]; // Air
    svc.startDive(startGas);

    expect(svc.getCurrentDepth()).toBe(0);
    expect(svc.getCurrentCeiling()).toBeCloseTo(0);
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
    const diveSettingsService = svc.settings;
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

  describe('getPO2WarningMessage', () => {
    it('returns warning when PO2 is between working max and deco max', () => {
      const result = svc.getPO2WarningMessage(1.5);
      expect(result).toBe('Oxygen partial pressure should only go above 1.4 during deco stops');
    });

    it('returns undefined when PO2 is within working limits', () => {
      const result = svc.getPO2WarningMessage(1.3);
      expect(result).toBeUndefined();
    });

    it('returns undefined when PO2 exceeds deco max', () => {
      const result = svc.getPO2WarningMessage(1.7);
      expect(result).toBeUndefined();
    });
  });

  describe('getPO2ErrorMessage', () => {
    it('returns error when PO2 exceeds deco max', () => {
      const result = svc.getPO2ErrorMessage(1.7);
      expect(result).toBe('Oxygen partial pressure should never go above 1.6');
    });

    it('returns error when PO2 is below minimum', () => {
      const result = svc.getPO2ErrorMessage(0.15);
      expect(result).toBe('Oxygen partial pressure should never go below 0.18');
    });

    it('returns undefined when PO2 is within limits', () => {
      const result = svc.getPO2ErrorMessage(1.3);
      expect(result).toBeUndefined();
    });
  });

  describe('getENDErrorMessage', () => {
    it('returns error when END exceeds threshold', () => {
      const result = svc.getENDErrorMessage(35);
      expect(result).toBeDefined();
    });

    it('returns undefined when END is within limits', () => {
      const result = svc.getENDErrorMessage(25);
      expect(result).toBeUndefined();
    });
  });
});
