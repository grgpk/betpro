import { createAction, props } from '@ngrx/store';
import { Bet } from '../../models/bet.model';

export const addToBetslip = createAction('[Betslip] Add Bet', props<{ bet: Bet }>());

export const removeFromBetslip = createAction('[Betslip] Remove Bet', props<{ betId: string }>());

export const updateStake = createAction(
  '[Betslip] Update Stake',
  props<{ betId: string; stake: number }>(),
);

export const clearBetslip = createAction('[Betslip] Clear Betslip');

export const placeBet = createAction('[Betslip] Place Bet');

export const placeBetSuccess = createAction('[Betslip] Place Bet Success');

export const placeBetFailure = createAction(
  '[Betslip] Place Bet Failure',
  props<{ error: string }>(),
);

export const loadBetslipFromStorage = createAction('[Betslip] Load From Storage');

export const updateOdds = createAction(
  '[Betslip] Update Odds',
  props<{ eventId: string; newOdds: { home: number; draw?: number; away: number } }>(),
);
