import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BetslipState } from './betslip.reducer';

export const selectBetslipState = createFeatureSelector<BetslipState>('betslip');

export const selectBetslipBets = createSelector(selectBetslipState, (state) => state.bets);

export const selectBetslipCount = createSelector(selectBetslipBets, (bets) => bets.length);

export const selectBetslipTotalOdds = createSelector(selectBetslipBets, (bets) =>
  bets.reduce((acc, bet) => acc * bet.odds, 1)
);

export const selectBetslipTotalStake = createSelector(selectBetslipBets, (bets) =>
  bets.reduce((acc, bet) => acc + (bet.stake || 0), 0)
);

export const selectBetslipPotentialWin = createSelector(selectBetslipBets, (bets) => {
  const totalStake = bets.reduce((acc, bet) => acc + (bet.stake || 0), 0);
  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  return totalStake * totalOdds;
});

export const selectBetslipLoading = createSelector(selectBetslipState, (state) => state.loading);

export const selectBetslipError = createSelector(selectBetslipState, (state) => state.error);
