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

  on(BetHistoryActions.deleteBetFromHistory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BetHistoryActions.deleteBetFromHistorySuccess, (state, { betId }) => ({
    ...state,
    history: state.history.filter((bet) => bet.id !== betId),
    loading: false,
    error: null,
  })),

  on(BetHistoryActions.deleteBetFromHistoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(BetHistoryActions.clearBetHistory, (state) => ({
    ...state,
    history: [],
  })),
);
