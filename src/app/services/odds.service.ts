import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable, switchMap, take, tap } from 'rxjs';
import { selectAllEvents } from '../store/events/events.selectors';
import { updateOdds } from '../store/events/events.actions';
import { SportEvent } from '../models/sport-event.model';

@Injectable({
  providedIn: 'root',
})
export class OddsService {
  private store = inject(Store);
  private updateInterval = 2000; // Update every 5 seconds

  startOddsSimulation(): Observable<SportEvent[]> {
    return interval(this.updateInterval).pipe(
      switchMap(() => this.store.select(selectAllEvents).pipe(take(1))),
      tap((events) => {
        events.forEach((event) => {
          if (event.isLive) {
            const newOdds = this.generateRandomOdds(event.odds);
            this.store.dispatch(updateOdds({ eventId: event.id, odds: newOdds }));
          }
        });
      })
    );
  }

  private generateRandomOdds(currentOdds: { home: number; draw?: number; away: number }): {
    home: number;
    draw?: number;
    away: number;
  } {
    const variation = 0.1; // 10% variation

    const home = this.adjustOdds(currentOdds.home, variation);
    const away = this.adjustOdds(currentOdds.away, variation);
    const draw = currentOdds.draw ? this.adjustOdds(currentOdds.draw, variation) : undefined;

    return { home, draw, away };
  }

  private adjustOdds(odds: number, variation: number): number {
    const change = (Math.random() - 0.5) * 2 * variation;
    const newOdds = odds * (1 + change);

    // Ensure odds stay within valid range
    return Math.max(1.01, Math.min(100, Math.round(newOdds * 100) / 100));
  }
}
