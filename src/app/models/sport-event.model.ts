export interface SportEvent {
  id: string;
  title: string;
  description: string;
  sport: 'football' | 'basketball' | 'tennis' | 'volleyball';
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  isLive: boolean;
}
