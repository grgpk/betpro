import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as BetHistoryActions from './bet-history.actions';
import * as BetslipActions from '../betslip/betslip.actions';
import { Store } from '@ngrx/store';
import {
  selectBetslipBets,
  selectBetslipTotalOdds,
  selectBetslipTotalStake,
  selectBetslipPotentialWin,
} from '../betslip/betslip.selectors';
import { selectBetHistory } from './bet-history.selectors';
import { withLatestFrom } from 'rxjs/operators';
import { BetHistoryItem } from '../../models/bet-history.model';

@Injectable()
export class BetHistoryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // Load bet history from localStorage on init
  loadBetHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetHistoryActions.loadBetHistory),
      map(() => {
        const storedHistory = localStorage.getItem('betHistory');
        if (storedHistory) {
          try {
            const history = JSON.parse(storedHistory);
            // Convert date strings back to Date objects
            const parsedHistory = history.map((bet: Partial<BetHistoryItem>) => ({
              ...bet,
              placedAt: new Date(bet.placedAt!),
              settledAt: bet.settledAt ? new Date(bet.settledAt) : undefined,
            }));
            return BetHistoryActions.loadBetHistorySuccess({ history: parsedHistory });
          } catch {
            return BetHistoryActions.loadBetHistoryFailure({
              error: 'Failed to load bet history',
            });
          }
        }
        return BetHistoryActions.loadBetHistorySuccess({ history: [] });
      }),
    ),
  );

  // Save to localStorage whenever history changes
  saveBetHistory$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BetHistoryActions.addBetToHistory,
          BetHistoryActions.updateBetStatus,
          BetHistoryActions.deleteBetFromHistory,
          BetHistoryActions.clearBetHistory,
        ),
        withLatestFrom(this.store.select(selectBetHistory)),
        tap(([, history]) => {
          localStorage.setItem('betHistory', JSON.stringify(history));
        }),
      ),
    { dispatch: false },
  );

  // When bet is placed successfully, add to history
  addToHistoryOnBetPlaced$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetslipActions.placeBetSuccess),
      withLatestFrom(
        this.store.select(selectBetslipBets),
        this.store.select(selectBetslipTotalStake),
        this.store.select(selectBetslipTotalOdds),
        this.store.select(selectBetslipPotentialWin),
      ),
      map(([, bets, totalStake, totalOdds, potentialWin]) => {
        const historyItem = {
          id: `bet-${Date.now()}`,
          bets: [...bets],
          totalStake,
          totalOdds,
          potentialWin,
          status: 'pending' as const,
          placedAt: new Date(),
        };
        return BetHistoryActions.addBetToHistory({ bet: historyItem });
      }),
    ),
  );
}
