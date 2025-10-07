import { createReducer, on } from '@ngrx/store';
import { BetHistoryItem } from '../../models/bet-history.model';
import * as BetHistoryActions from './bet-history.actions';

export interface BetHistoryState {
  history: BetHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: BetHistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const betHistoryReducer = createReducer(
  initialState,

  on(BetHistoryActions.loadBetHistory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BetHistoryActions.loadBetHistorySuccess, (state, { history }) => ({
    ...state,
    history,
    loading: false,
    error: null,
  })),

  on(BetHistoryActions.loadBetHistoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(BetHistoryActions.addBetToHistory, (state, { bet }) => ({
    ...state,
    history: [bet, ...state.history],
  })),

  on(BetHistoryActions.updateBetStatus, (state, { betId, status, actualWin }) => ({
    ...state,
    history: state.history.map((bet) =>
      bet.id === betId
        ? {
            ...bet,
            status,
            actualWin,
            settledAt: new Date(),
          }
        : bet,
    ),
  })),

  on(BetHistoryActions.deleteBetFromHistory, (state, { betId }) => ({
    ...state,
    history: state.history.filter((bet) => bet.id !== betId),
  })),

  on(BetHistoryActions.clearBetHistory, (state) => ({
    ...state,
    history: [],
  })),
);
