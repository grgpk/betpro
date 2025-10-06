/**
 * Get the Material color theme for an event status
 * @param status - The event status ('live', 'upcoming', 'finished')
 * @returns The Material color ('warn', 'primary', 'accent', or empty string)
 */
export function getEventStatusColor(status: string): 'warn' | 'primary' | 'accent' | '' {
  switch (status) {
    case 'live':
      return 'warn';
    case 'upcoming':
      return 'primary';
    case 'finished':
      return 'accent';
    default:
      return '';
  }
}
