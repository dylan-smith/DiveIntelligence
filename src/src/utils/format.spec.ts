import { humanDuration, colonDuration } from './format';

describe('format functions', () => {
  describe('humanDuration', () => {
    it('should return 0 sec for zero', () => {
      expect(humanDuration(0)).toBe('0 sec');
    });

    it('should format seconds only', () => {
      expect(humanDuration(30)).toBe('30 sec');
      expect(humanDuration(59)).toBe('59 sec');
    });

    it('should format minutes only', () => {
      expect(humanDuration(60)).toBe('1 min');
      expect(humanDuration(120)).toBe('2 min');
      expect(humanDuration(300)).toBe('5 min');
    });

    it('should format minutes and seconds', () => {
      expect(humanDuration(90)).toBe('1 min 30 sec');
      expect(humanDuration(150)).toBe('2 min 30 sec');
      expect(humanDuration(3661)).toBe('61 min 1 sec');
    });

    it('should handle large values', () => {
      expect(humanDuration(3600)).toBe('60 min');
      expect(humanDuration(7200)).toBe('120 min');
    });

    it('should round seconds', () => {
      expect(humanDuration(90.5)).toBe('1 min 31 sec');
      expect(humanDuration(90.4)).toBe('1 min 30 sec');
    });
  });

  describe('colonDuration', () => {
    it('should format zero', () => {
      expect(colonDuration(0)).toBe('0:00');
    });

    it('should format seconds only', () => {
      expect(colonDuration(5)).toBe('0:05');
      expect(colonDuration(30)).toBe('0:30');
      expect(colonDuration(59)).toBe('0:59');
    });

    it('should format minutes and seconds', () => {
      expect(colonDuration(60)).toBe('1:00');
      expect(colonDuration(90)).toBe('1:30');
      expect(colonDuration(125)).toBe('2:05');
    });

    it('should format hours', () => {
      expect(colonDuration(3600)).toBe('1:00:00');
      expect(colonDuration(3661)).toBe('1:01:01');
      expect(colonDuration(7325)).toBe('2:02:05');
    });

    it('should pad minutes and seconds with zeros', () => {
      expect(colonDuration(3605)).toBe('1:00:05');
      expect(colonDuration(3665)).toBe('1:01:05');
    });

    it('should handle large values', () => {
      expect(colonDuration(36000)).toBe('10:00:00');
      expect(colonDuration(86399)).toBe('23:59:59');
    });
  });
});
