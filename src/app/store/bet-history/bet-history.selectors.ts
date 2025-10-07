import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BetHistoryState } from './bet-history.reducer';

export const selectBetHistoryState = createFeatureSelector<BetHistoryState>('betHistory');

export const selectBetHistory = createSelector(selectBetHistoryState, (state) => state.history);

export const selectBetHistoryLoading = createSelector(
  selectBetHistoryState,
  (state) => state.loading,
);

export const selectBetHistoryError = createSelector(selectBetHistoryState, (state) => state.error);

export const selectPendingBets = createSelector(selectBetHistory, (history) =>
  history.filter((bet) => bet.status === 'pending'),
);

export const selectSettledBets = createSelector(selectBetHistory, (history) =>
  history.filter((bet) => bet.status !== 'pending'),
);

export const selectWonBets = createSelector(selectBetHistory, (history) =>
  history.filter((bet) => bet.status === 'won'),
);

export const selectLostBets = createSelector(selectBetHistory, (history) =>
  history.filter((bet) => bet.status === 'lost'),
);

export const selectTotalWinnings = createSelector(selectWonBets, (wonBets) =>
  wonBets.reduce((sum, bet) => sum + (bet.actualWin || 0), 0),
);

export const selectTotalLosses = createSelector(selectLostBets, (lostBets) =>
  lostBets.reduce((sum, bet) => sum + bet.totalStake, 0),
);

export const selectNetProfit = createSelector(
  selectTotalWinnings,
  selectTotalLosses,
  (winnings, losses) => winnings - losses,
);
