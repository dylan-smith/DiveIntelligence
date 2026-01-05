import { Tissue } from './Tissue';
import { BreathingGas } from './BreathingGas';
import { DiveSettingsService } from './DiveSettings.service';
import { DiveSegment } from './DiveSegment';

describe('Tissue Time to Fly', () => {
  let diveSettings: DiveSettingsService;
  let air: BreathingGas;

  beforeEach(() => {
    diveSettings = new DiveSettingsService();
    // Initialize StandardGases to avoid the find error
    BreathingGas.StandardGases = [];
    air = BreathingGas.create(21, 0, 79, diveSettings);
  });

  it('should return 0 for surface conditions', () => {
    // Test tissue compartment 1 (fastest) - 5 minute N2 half-life
    const tissue = new Tissue(1, 5, 1.1696, 0.5578, 1.51, 1.7474, 0.4245);
    
    // At surface, should be 0 time to fly
    const timeToFly = tissue.getTimeToFly();
    expect(timeToFly).toBe(0);
  });
});