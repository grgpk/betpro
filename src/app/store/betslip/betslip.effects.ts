import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import * as BetslipActions from './betslip.actions';
import { selectBetslipBets } from './betslip.selectors';

@Injectable()
export class BetslipEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // Save to localStorage whenever betslip changes
  saveBetslip$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BetslipActions.addToBetslip,
          BetslipActions.removeFromBetslip,
          BetslipActions.updateStake,
          BetslipActions.clearBetslip
        ),
        switchMap(() =>
          this.store.select(selectBetslipBets).pipe(
            tap((bets) => {
              localStorage.setItem('betslip', JSON.stringify(bets));
            })
          )
        )
      ),
    { dispatch: false }
  );

  // Simulate placing bet
  placeBet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BetslipActions.placeBet),
      delay(1000), // Simulate API call
      map(() => {
        // Clear localStorage
        localStorage.removeItem('betslip');
        return BetslipActions.placeBetSuccess();
      })
    )
  );
}
