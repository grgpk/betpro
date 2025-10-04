import { createReducer, on } from '@ngrx/store';
import { Bet } from '../../models/bet.model';
import * as BetslipActions from './betslip.actions';

export interface BetslipState {
  bets: Bet[];
  loading: boolean;
  error: string | null;
}

const initialState: BetslipState = {
  bets: [],
  loading: false,
  error: null,
};

export const betslipReducer = createReducer(
  initialState,

  // Add to Betslip
  on(BetslipActions.addToBetslip, (state, { bet }) => {
    // Check if bet for this event already exists
    const existingBetIndex = state.bets.findIndex((b) => b.eventId === bet.eventId);

    if (existingBetIndex >= 0) {
      // Replace existing bet
      const updatedBets = [...state.bets];
      updatedBets[existingBetIndex] = bet;
      return {
        ...state,
        bets: updatedBets,
      };
    } else {
      // Add new bet
      return {
        ...state,
        bets: [...state.bets, bet],
      };
    }
  }),

  // Remove from Betslip
  on(BetslipActions.removeFromBetslip, (state, { betId }) => ({
    ...state,
    bets: state.bets.filter((b) => b.id !== betId),
  })),

  // Update Stake
  on(BetslipActions.updateStake, (state, { betId, stake }) => ({
    ...state,
    bets: state.bets.map((b) => (b.id === betId ? { ...b, stake } : b)),
  })),

  // Clear Betslip
  on(BetslipActions.clearBetslip, () => initialState),

  // Place Bet
  on(BetslipActions.placeBet, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BetslipActions.placeBetSuccess, () => initialState),

  on(BetslipActions.placeBetFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load from Storage
  on(BetslipActions.loadBetslipFromStorage, (state) => {
    const storedBetslip = localStorage.getItem('betslip');
    if (storedBetslip) {
      try {
        const bets = JSON.parse(storedBetslip);
        return { ...state, bets };
      } catch {
        return state;
      }
    }
    return state;
  })
);
