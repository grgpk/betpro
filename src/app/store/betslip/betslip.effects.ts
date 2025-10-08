import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { delay, switchMap, tap, withLatestFrom, mergeMap } from 'rxjs/operators';
import * as BetslipActions from './betslip.actions';
import * as BetHistoryActions from '../bet-history/bet-history.actions';
import {
  selectBetslipBets,
  selectBetslipTotalStake,
  selectBetslipTotalOdds,
  selectBetslipPotentialWin,
} from './betslip.selectors';

@Injectable()
export class BetslipEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  saveBetslip$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BetslipActions.addToBetslip,
          BetslipActions.removeFromBetslip,
          BetslipActions.updateStake,
          BetslipActions.updateOdds,
          BetslipActions.clearBetslip,
        ),
        switchMap(() =>
          this.store.select(selectBetslipBets).pipe(
            tap((bets) => {
              localStorage.setItem('betslip', JSON.stringify(bets));
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  // Simulate placing bet
  placeBet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetslipActions.placeBet),
      withLatestFrom(
        this.store.select(selectBetslipBets),
        this.store.select(selectBetslipTotalStake),
        this.store.select(selectBetslipTotalOdds),
        this.store.select(selectBetslipPotentialWin),
      ),
      delay(1000),
      mergeMap(([, bets, totalStake, totalOdds, potentialWin]) => {
        localStorage.removeItem('betslip');

        const historyItem = {
          id: `bet-${Date.now()}`,
          bets: [...bets],
          totalStake,
          totalOdds,
          potentialWin,
          status: 'pending' as const,
          placedAt: new Date(),
        };

        return [
          BetHistoryActions.addBetToHistory({ bet: historyItem }),
          BetslipActions.placeBetSuccess(),
        ];
      }),
    ),
  );
}
