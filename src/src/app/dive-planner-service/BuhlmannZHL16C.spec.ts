import { BuhlmannZHL16C } from './BuhlmannZHL16C';
import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';
import { DiveSegment } from './DiveSegment';

describe('BuhlmannZHL16C', () => {
  let diveSettings: DiveSettingsService;
  let air: BreathingGas;
  let model: BuhlmannZHL16C;

  beforeEach(() => {
    diveSettings = new DiveSettingsService();
    // Initialize StandardGases to avoid the find error
    BreathingGas.StandardGases = [];
    air = BreathingGas.create(21, 0, 79, diveSettings);
    model = new BuhlmannZHL16C();
  });

  it('should calculate time to fly for surface conditions', () => {
    // At surface with no dive, should be 0 time to fly
    const timeToFly = model.getTimeToFly();
    expect(timeToFly).toBe(0);
  });

  it('should calculate time to fly after a dive', () => {
    // Simulate a dive to 30m for 30 minutes
    const segment = new DiveSegment(0, 1800, 'Test', 'Test dive', 30, 30, air, 'test', diveSettings);
    model.calculateForSegment(segment);
    
    // Should have some time to fly after nitrogen loading
    const timeToFly = model.getTimeToFly();
    expect(timeToFly).toBeDefined();
    expect(timeToFly).toBeGreaterThan(0);
    
    // Should be reasonable time (less than 24 hours for a moderate dive)
    expect(timeToFly).toBeLessThan(24 * 3600);
  });

  it('should calculate longer time to fly for deeper/longer dives', () => {
    // Simulate two different dives
    const shallowDive = new DiveSegment(0, 1800, 'Shallow', 'Shallow dive', 20, 20, air, 'test', diveSettings);
    const deepDive = new DiveSegment(0, 1800, 'Deep', 'Deep dive', 40, 40, air, 'test', diveSettings);
    
    const shallowModel = new BuhlmannZHL16C();
    const deepModel = new BuhlmannZHL16C();
    
    shallowModel.calculateForSegment(shallowDive);
    deepModel.calculateForSegment(deepDive);
    
    const shallowTimeToFly = shallowModel.getTimeToFly();
    const deepTimeToFly = deepModel.getTimeToFly();
    
    expect(shallowTimeToFly).toBeDefined();
    expect(deepTimeToFly).toBeDefined();
    
    if (shallowTimeToFly !== undefined && deepTimeToFly !== undefined) {
      expect(deepTimeToFly).toBeGreaterThan(shallowTimeToFly);
    }
  });

  it('should use custom flying threshold', () => {
    // Simulate a dive to 30m for 30 minutes
    const segment = new DiveSegment(0, 1800, 'Test', 'Test dive', 30, 30, air, 'test', diveSettings);
    model.calculateForSegment(segment);
    
    // Compare different thresholds
    const conservativeTime = model.getTimeToFly(0.80); // More conservative
    const standardTime = model.getTimeToFly(0.869); // Standard (110% of ambient)
    const liberalTime = model.getTimeToFly(0.95); // More liberal
    
    expect(conservativeTime).toBeDefined();
    expect(standardTime).toBeDefined();
    expect(liberalTime).toBeDefined();
    
    if (conservativeTime !== undefined && standardTime !== undefined && liberalTime !== undefined) {
      expect(conservativeTime).toBeGreaterThan(standardTime);
      expect(standardTime).toBeGreaterThan(liberalTime);
    }
  });

  it('should return controlling tissue time', () => {
    // Simulate a dive that loads multiple tissues
    const segment = new DiveSegment(0, 3600, 'Test', 'Long dive', 25, 25, air, 'test', diveSettings);
    model.calculateForSegment(segment);
    
    const timeToFly = model.getTimeToFly();
    
    // The result should be reasonable for a long shallow dive
    expect(timeToFly).toBeDefined();
    expect(timeToFly).toBeGreaterThan(0);
    
    // Should be controlled by slower tissues for longer dives
    expect(timeToFly).toBeGreaterThan(3600); // More than 1 hour for a 1-hour dive
  });
});