import type { Sport, EventStatus } from '../components/event-list/types';

export interface SportEvent {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status: EventStatus;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  isLive: boolean;
}
