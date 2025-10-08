import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as BetHistoryActions from './bet-history.actions';
import { BetHistoryService } from '../../services/bet-history/bet-history.service';

@Injectable()
export class BetHistoryEffects {
  private actions$ = inject(Actions);
  private betHistoryService = inject(BetHistoryService);

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
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addBetToHistory$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BetHistoryActions.addBetToHistory),
        mergeMap(({ bet }) => this.betHistoryService.addBetHistory(bet)),
      ),
    { dispatch: false },
  );

  deleteBet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetHistoryActions.deleteBetFromHistory),
      mergeMap(({ betId }) =>
        this.betHistoryService.deleteBetHistory(betId).pipe(
          map(() => BetHistoryActions.deleteBetFromHistorySuccess({ betId })),
          catchError((error) =>
            of(
              BetHistoryActions.deleteBetFromHistoryFailure({
                betId,
                error: error.message || 'Failed to delete bet',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
