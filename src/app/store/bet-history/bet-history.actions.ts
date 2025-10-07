import { createAction, props } from '@ngrx/store';
import { BetHistoryItem } from '../../models/bet-history.model';

export const loadBetHistory = createAction('[Bet History] Load Bet History');

export const loadBetHistorySuccess = createAction(
  '[Bet History] Load Bet History Success',
  props<{ history: BetHistoryItem[] }>(),
);

export const loadBetHistoryFailure = createAction(
  '[Bet History] Load Bet History Failure',
  props<{ error: string }>(),
);

export const addBetToHistory = createAction(
  '[Bet History] Add Bet',
  props<{ bet: BetHistoryItem }>(),
);

export const updateBetStatus = createAction(
  '[Bet History] Update Bet Status',
  props<{ betId: string; status: 'won' | 'lost' | 'void'; actualWin?: number }>(),
);

export const deleteBetFromHistory = createAction(
  '[Bet History] Delete Bet',
  props<{ betId: string }>(),
);

export const clearBetHistory = createAction('[Bet History] Clear All History');
