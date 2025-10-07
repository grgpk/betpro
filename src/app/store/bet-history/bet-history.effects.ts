import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as BetHistoryActions from './bet-history.actions';
import * as BetslipActions from '../betslip/betslip.actions';
import { Store } from '@ngrx/store';
import {
  selectBetslipBets,
  selectBetslipTotalOdds,
  selectBetslipTotalStake,
  selectBetslipPotentialWin,
} from '../betslip/betslip.selectors';
import { withLatestFrom } from 'rxjs/operators';
import { BetHistoryService } from '../../services/bet-history.service';

@Injectable()
export class BetHistoryEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private betHistoryService = inject(BetHistoryService);

  // Load bet history from API on init
  loadBetHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetHistoryActions.loadBetHistory),
      mergeMap(() =>
        this.betHistoryService.getBetHistory().pipe(
          map((history) => BetHistoryActions.loadBetHistorySuccess({ history })),
          catchError((error) =>
            of(
              BetHistoryActions.loadBetHistoryFailure({
                error: error.message || 'Failed to load bet history',
              })
            )
          )
        )
      )
    )
  );

  // When bet is placed successfully, add to history via API
  addToHistoryOnBetPlaced$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetslipActions.placeBetSuccess),
      withLatestFrom(
        this.store.select(selectBetslipBets),
        this.store.select(selectBetslipTotalStake),
        this.store.select(selectBetslipTotalOdds),
        this.store.select(selectBetslipPotentialWin)
      ),
      mergeMap(([, bets, totalStake, totalOdds, potentialWin]) => {
        const historyItem = {
          id: `bet-${Date.now()}`,
          bets: [...bets],
          totalStake,
          totalOdds,
          potentialWin,
          status: 'pending' as const,
          placedAt: new Date(),
        };
        return this.betHistoryService.addBetHistory(historyItem).pipe(
          map((bet) => BetHistoryActions.addBetToHistory({ bet })),
          catchError(() => of(BetHistoryActions.addBetToHistory({ bet: historyItem })))
        );
      })
    )
  );

  // Delete bet from API
  deleteBet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetHistoryActions.deleteBetFromHistory),
      mergeMap(({ betId }) =>
        this.betHistoryService.deleteBetHistory(betId).pipe(
          map(() => BetHistoryActions.deleteBetFromHistory({ betId })),
          catchError(() => of(BetHistoryActions.deleteBetFromHistory({ betId })))
        )
      )
    )
  );

  // Update bet status via API
  updateBetStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetHistoryActions.updateBetStatus),
      mergeMap(({ betId, status, actualWin }) => {
        const settledAt = new Date();
        return this.betHistoryService
          .updateBetHistory(betId, { status, actualWin, settledAt })
          .pipe(
            map(() => BetHistoryActions.updateBetStatus({ betId, status, actualWin })),
            catchError(() => of(BetHistoryActions.updateBetStatus({ betId, status, actualWin })))
          );
      })
    )
  );
}
