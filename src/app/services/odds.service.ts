import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable, switchMap, take, tap } from 'rxjs';
import { SportEvent } from '../models/sport-event.model';
import * as BetslipActions from '../store/betslip/betslip.actions';
import { updateOdds } from '../store/events/events.actions';
import { selectAllEvents } from '../store/events/events.selectors';

@Injectable({
  providedIn: 'root',
})
export class OddsService {
  private store = inject(Store);
  private updateInterval = 3000;

  startOddsSimulation(): Observable<SportEvent[]> {
    return interval(this.updateInterval).pipe(
      switchMap(() => this.store.select(selectAllEvents).pipe(take(1))),
      tap((events) => {
        events.forEach((event) => {
          if (event.isLive) {
            const newOdds = this.generateRandomOdds(event.odds);
            this.store.dispatch(updateOdds({ eventId: event.id, odds: newOdds }));

            this.store.dispatch(
              BetslipActions.updateOdds({
                eventId: event.id,
                newOdds,
              }),
            );
          }
        });
      }),
    );
  }

  private generateRandomOdds(currentOdds: { home: number; draw?: number; away: number }): {
    home: number;
    draw?: number;
    away: number;
  } {
    const home = +(Math.random() * 3 + 1).toFixed(2);
    const away = +(Math.random() * 2 + 2.5).toFixed(2);
    const draw = currentOdds.draw ? +(Math.random() * 3 + 1).toFixed(2) : undefined;

    return { home, draw, away };
  }
}
