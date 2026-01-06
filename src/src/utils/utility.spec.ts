import { ceilingWithThreshold, floorWithThreshold } from './utility';

describe('utility functions', () => {
  describe('ceilingWithThreshold', () => {
    it('should return ceiling for normal values', () => {
      expect(ceilingWithThreshold(1.5)).toBe(2);
      expect(ceilingWithThreshold(2.1)).toBe(3);
      expect(ceilingWithThreshold(3.9)).toBe(4);
    });

    it('should handle values very close to integers', () => {
      expect(ceilingWithThreshold(2.9999999)).toBe(3);
      expect(ceilingWithThreshold(3.0000001)).toBe(3);
    });

    it('should handle exact integers', () => {
      expect(ceilingWithThreshold(2)).toBe(2);
      expect(ceilingWithThreshold(5)).toBe(5);
    });

    it('should handle negative values', () => {
      expect(ceilingWithThreshold(-1.5)).toBe(-1);
      expect(ceilingWithThreshold(-2.9)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(ceilingWithThreshold(0)).toBeCloseTo(0);
    });

    it('should use custom threshold', () => {
      expect(ceilingWithThreshold(2.999, 0.01)).toBe(3);
      expect(ceilingWithThreshold(2.99, 0.1)).toBe(3);
    });
  });

  describe('floorWithThreshold', () => {
    it('should return floor for normal values', () => {
      expect(floorWithThreshold(1.5)).toBe(1);
      expect(floorWithThreshold(2.1)).toBe(2);
      expect(floorWithThreshold(3.9)).toBe(3);
    });

    it('should handle values very close to integers', () => {
      expect(floorWithThreshold(2.0000001)).toBe(2);
      expect(floorWithThreshold(2.9999999)).toBe(3);
    });

    it('should handle exact integers', () => {
      expect(floorWithThreshold(2)).toBe(2);
      expect(floorWithThreshold(5)).toBe(5);
    });

    it('should handle negative values', () => {
      expect(floorWithThreshold(-1.5)).toBe(-2);
      expect(floorWithThreshold(-2.1)).toBe(-3);
    });

    it('should handle zero', () => {
      expect(floorWithThreshold(0)).toBe(0);
    });

    it('should use custom threshold', () => {
      expect(floorWithThreshold(2.001, 0.01)).toBe(2);
      expect(floorWithThreshold(2.01, 0.1)).toBe(2);
    });
  });
});
