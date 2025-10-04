export interface Bet {
  id: string; // Unique bet ID
  eventId: string; // The ID of the related SportEvent
  eventTitle: string; // Title of the event (for display)
  selection: 'home' | 'draw' | 'away'; // User's choice
  odds: number; // Odds for the selected outcome
  stake?: number; // Bet amount (optional, entered by user)
}
