import { createAction, props } from '@ngrx/store';
import { Bet } from '../../models/bet.model';

// Add to Betslip
export const addToBetslip = createAction('[Betslip] Add Bet', props<{ bet: Bet }>());

// Remove from Betslip
export const removeFromBetslip = createAction('[Betslip] Remove Bet', props<{ betId: string }>());

// Update Stake
export const updateStake = createAction(
  '[Betslip] Update Stake',
  props<{ betId: string; stake: number }>()
);

// Clear Betslip
export const clearBetslip = createAction('[Betslip] Clear Betslip');

// Place Bet
export const placeBet = createAction('[Betslip] Place Bet');

export const placeBetSuccess = createAction('[Betslip] Place Bet Success');

export const placeBetFailure = createAction(
  '[Betslip] Place Bet Failure',
  props<{ error: string }>()
);

// Load from LocalStorage
export const loadBetslipFromStorage = createAction('[Betslip] Load From Storage');
