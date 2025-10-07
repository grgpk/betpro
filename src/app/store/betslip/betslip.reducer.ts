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

  on(BetslipActions.addToBetslip, (state, { bet }) => {
    const existingBetIndex = state.bets.findIndex((b) => b.eventId === bet.eventId);

    if (existingBetIndex >= 0) {
      const updatedBets = [...state.bets];
      updatedBets[existingBetIndex] = bet;
      return {
        ...state,
        bets: updatedBets,
      };
    } else {
      return {
        ...state,
        bets: [...state.bets, bet],
      };
    }
  }),

  on(BetslipActions.removeFromBetslip, (state, { betId }) => ({
    ...state,
    bets: state.bets.filter((b) => b.id !== betId),
  })),

  on(BetslipActions.updateStake, (state, { betId, stake }) => ({
    ...state,
    bets: state.bets.map((b) => (b.id === betId ? { ...b, stake } : b)),
  })),

  on(BetslipActions.clearBetslip, () => initialState),

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
  }),

  on(BetslipActions.updateOdds, (state, { eventId, newOdds }) => ({
    ...state,
    bets: state.bets.map((bet) =>
      bet.eventId === eventId ? { ...bet, odds: newOdds[bet.selection]! } : bet,
    ),
  })),
);
