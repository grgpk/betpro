import { getEventStatusColor } from './event.utils';

describe('Event Utils', () => {
  describe('getEventStatusColor', () => {
    it('should return "warn" for live status', () => {
      expect(getEventStatusColor('live')).toBe('warn');
    });

    it('should return "primary" for upcoming status', () => {
      expect(getEventStatusColor('upcoming')).toBe('primary');
    });

    it('should return "accent" for finished status', () => {
      expect(getEventStatusColor('finished')).toBe('accent');
    });

    it('should return empty string for unknown status', () => {
      expect(getEventStatusColor('unknown')).toBe('');
      expect(getEventStatusColor('')).toBe('');
    });
  });
});
