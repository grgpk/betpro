export interface SportEvent {
  id: string; // Unique ID
  title: string; // Min 2, max 100 characters
  description: string; // Min 2, max 200 characters
  sport: 'football' | 'basketball' | 'tennis' | 'volleyball'; // Sport type
  homeTeam: string; // Min 2, max 50 characters
  awayTeam: string; // Min 2, max 50 characters
  startTime: Date; // Event start time
  status: 'upcoming' | 'live' | 'finished'; // Event status
  odds: {
    home: number; // Min 1.01, max 100
    draw?: number; // Optional (some sports don't have draw)
    away: number; // Min 1.01, max 100
  };
  isLive: boolean; // Whether the event is live
}
