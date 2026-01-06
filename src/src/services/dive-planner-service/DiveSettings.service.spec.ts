import { DiveSettingsService } from './DiveSettings.service';

describe('DiveSettingsService', () => {
  let settings: DiveSettingsService;

  beforeEach(() => {
    settings = new DiveSettingsService();
  });

  describe('default values', () => {
    it('should have correct default ascent rate', () => {
      expect(settings.ascentRate).toBe(10);
    });

    it('should have correct default descent rate', () => {
      expect(settings.descentRate).toBe(20);
    });

    it('should have correct default working PO2 maximum', () => {
      expect(settings.workingPO2Maximum).toBe(1.4);
    });

    it('should have correct default deco PO2 maximum', () => {
      expect(settings.decoPO2Maximum).toBe(1.6);
    });

    it('should have correct default PO2 minimum', () => {
      expect(settings.pO2Minimum).toBe(0.18);
    });

    it('should have correct default END error threshold', () => {
      expect(settings.ENDErrorThreshold).toBe(30);
    });

    it('should have oxygen narcotic enabled by default', () => {
      expect(settings.isOxygenNarcotic).toBe(true);
    });
  });

  describe('tooltips', () => {
    it('should have MaxDepthPO2Tooltip', () => {
      expect(settings.MaxDepthPO2Tooltip).toBeDefined();
      expect(settings.MaxDepthPO2Tooltip.length).toBeGreaterThan(0);
    });

    it('should have MaxDepthENDTooltip', () => {
      expect(settings.MaxDepthENDTooltip).toBeDefined();
      expect(settings.MaxDepthENDTooltip.length).toBeGreaterThan(0);
    });

    it('should have MinDepthTooltip', () => {
      expect(settings.MinDepthTooltip).toBeDefined();
      expect(settings.MinDepthTooltip.length).toBeGreaterThan(0);
    });

    it('should have ENDErrorMessage', () => {
      expect(settings.ENDErrorMessage).toBeDefined();
      expect(settings.ENDErrorMessage.length).toBeGreaterThan(0);
    });
  });

  describe('settings modification', () => {
    it('should allow changing ascent rate', () => {
      settings.ascentRate = 9;
      expect(settings.ascentRate).toBe(9);
    });

    it('should allow changing descent rate', () => {
      settings.descentRate = 18;
      expect(settings.descentRate).toBe(18);
    });

    it('should allow changing working PO2 maximum', () => {
      settings.workingPO2Maximum = 1.3;
      expect(settings.workingPO2Maximum).toBe(1.3);
    });

    it('should allow changing deco PO2 maximum', () => {
      settings.decoPO2Maximum = 1.5;
      expect(settings.decoPO2Maximum).toBe(1.5);
    });

    it('should allow changing PO2 minimum', () => {
      settings.pO2Minimum = 0.16;
      expect(settings.pO2Minimum).toBe(0.16);
    });

    it('should allow changing END error threshold', () => {
      settings.ENDErrorThreshold = 40;
      expect(settings.ENDErrorThreshold).toBe(40);
    });

    it('should allow toggling oxygen narcotic', () => {
      settings.isOxygenNarcotic = false;
      expect(settings.isOxygenNarcotic).toBe(false);
    });
  });

  describe('subscribeToChanges', () => {
    it('should notify subscribers when settings change', () => {
      const callback = jest.fn();
      settings.subscribeToChanges(callback);
      
      settings.ascentRate = 8;
      
      expect(callback).toHaveBeenCalled();
    });

    it('should notify multiple subscribers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      settings.subscribeToChanges(callback1);
      settings.subscribeToChanges(callback2);
      
      settings.descentRate = 15;
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
});
