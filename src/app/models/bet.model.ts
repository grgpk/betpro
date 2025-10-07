export interface Bet {
  id: string;
  eventId: string;
  eventTitle: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake?: number;
}
