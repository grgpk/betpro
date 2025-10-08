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

export const deleteBetFromHistory = createAction(
  '[Bet History] Delete Bet',
  props<{ betId: string }>(),
);

export const deleteBetFromHistorySuccess = createAction(
  '[Bet History] Delete Bet Success',
  props<{ betId: string }>(),
);

export const deleteBetFromHistoryFailure = createAction(
  '[Bet History] Delete Bet Failure',
  props<{ betId: string; error: string }>(),
);

export const clearBetHistory = createAction('[Bet History] Clear All History');
