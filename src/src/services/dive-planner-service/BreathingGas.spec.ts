import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';

describe('BreathingGas', () => {
  let settings: DiveSettingsService;

  beforeEach(() => {
    settings = new DiveSettingsService();
    BreathingGas.GenerateStandardGases(settings);
  });

  describe('StandardGases', () => {
    it('should generate all standard gases', () => {
      expect(BreathingGas.StandardGases.length).toBe(11);
    });

    it('should include Air', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air');
      expect(air).toBeDefined();
      expect(air?.oxygen).toBe(21);
      expect(air?.helium).toBe(0);
      expect(air?.nitrogen).toBe(79);
    });

    it('should include Nitrox 32', () => {
      const nitrox32 = BreathingGas.StandardGases.find(g => g.name === 'Nitrox 32');
      expect(nitrox32).toBeDefined();
      expect(nitrox32?.oxygen).toBe(32);
      expect(nitrox32?.helium).toBe(0);
      expect(nitrox32?.nitrogen).toBe(68);
    });

    it('should include Oxygen', () => {
      const oxygen = BreathingGas.StandardGases.find(g => g.name === 'Oxygen');
      expect(oxygen).toBeDefined();
      expect(oxygen?.oxygen).toBe(100);
      expect(oxygen?.helium).toBe(0);
      expect(oxygen?.nitrogen).toBe(0);
    });

    it('should include Trimix gases', () => {
      const trimix1555 = BreathingGas.StandardGases.find(g => g.name === 'Trimix 15/55');
      expect(trimix1555).toBeDefined();
      expect(trimix1555?.oxygen).toBe(15);
      expect(trimix1555?.helium).toBe(55);
      expect(trimix1555?.nitrogen).toBe(30);
    });
  });

  describe('create', () => {
    it('should return standard gas when equivalent exists', () => {
      const gas = BreathingGas.create(21, 0, 79, settings);
      expect(gas.name).toBe('Air');
    });

    it('should return custom gas when no equivalent exists', () => {
      const gas = BreathingGas.create(28, 0, 72, settings);
      expect(gas.name).toBe('Custom');
      expect(gas.oxygen).toBe(28);
      expect(gas.nitrogen).toBe(72);
    });
  });

  describe('gas calculations', () => {
    it('should calculate correct PO2 at depth', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      expect(air.getPO2(0)).toBeCloseTo(0.21, 2);
      expect(air.getPO2(10)).toBeCloseTo(0.42, 2);
      expect(air.getPO2(30)).toBeCloseTo(0.84, 2);
    });

    it('should calculate correct PN2 at depth', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      expect(air.getPN2(0)).toBeCloseTo(0.79, 2);
      expect(air.getPN2(10)).toBeCloseTo(1.58, 2);
      expect(air.getPN2(30)).toBeCloseTo(3.16, 2);
    });

    it('should calculate correct PHe at depth', () => {
      const trimix = BreathingGas.StandardGases.find(g => g.name === 'Trimix 15/55')!;
      expect(trimix.getPHe(0)).toBeCloseTo(0.55, 2);
      expect(trimix.getPHe(10)).toBeCloseTo(1.1, 2);
      expect(trimix.getPHe(90)).toBeCloseTo(5.5, 2);
    });

    it('should calculate END for air', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      expect(air.getEND(0)).toBe(0);
      expect(air.getEND(30)).toBeCloseTo(30, 0);
    });

    it('should calculate END for trimix', () => {
      const trimix = BreathingGas.StandardGases.find(g => g.name === 'Trimix 15/55')!;
      // At 100m, END should be much less than actual depth due to helium
      const end = trimix.getEND(100);
      expect(end).toBeLessThan(100);
    });
  });

  describe('max depth calculations', () => {
    it('should calculate max depth PO2 for air', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      expect(air.maxDepthPO2).toBe(56);
      expect(air.maxDepthPO2Deco).toBe(66);
    });

    it('should calculate max depth PO2 for nitrox 32', () => {
      const nitrox32 = BreathingGas.StandardGases.find(g => g.name === 'Nitrox 32')!;
      expect(nitrox32.maxDepthPO2).toBe(33);
      expect(nitrox32.maxDepthPO2Deco).toBe(40);
    });

    it('should calculate max depth PO2 for oxygen', () => {
      const oxygen = BreathingGas.StandardGases.find(g => g.name === 'Oxygen')!;
      expect(oxygen.maxDepthPO2).toBe(4);
      expect(oxygen.maxDepthPO2Deco).toBe(6);
    });

    it('should calculate min depth for hypoxic mixes', () => {
      const trimix1070 = BreathingGas.StandardGases.find(g => g.name === 'Trimix 10/70')!;
      expect(trimix1070.minDepth).toBeGreaterThan(0);
    });
  });

  describe('getOptimalDecoGas', () => {
    it('should return optimal gas for shallow depth', () => {
      const gas = BreathingGas.getOptimalDecoGas(6, settings);
      expect(gas.oxygen).toBe(100);
    });

    it('should return lower oxygen for deeper depths', () => {
      const gas = BreathingGas.getOptimalDecoGas(21, settings);
      expect(gas.oxygen).toBeLessThan(100);
    });
  });

  describe('isEquivalent', () => {
    it('should return true for equivalent gases', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      const customAir = BreathingGas.create(21, 0, 79, settings);
      expect(air.isEquivalent(customAir)).toBe(true);
    });

    it('should return false for different gases', () => {
      const air = BreathingGas.StandardGases.find(g => g.name === 'Air')!;
      const nitrox32 = BreathingGas.StandardGases.find(g => g.name === 'Nitrox 32')!;
      expect(air.isEquivalent(nitrox32)).toBe(false);
    });
  });
});
