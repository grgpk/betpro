import { Bet } from './bet.model';

export type BetStatus = 'pending' | 'won' | 'lost' | 'void';

export interface BetHistoryItem {
  id: string;
  bets: Bet[];
  totalStake: number;
  totalOdds: number;
  potentialWin: number;
  actualWin?: number;
  status: BetStatus;
  placedAt: Date;
  settledAt?: Date;
}
