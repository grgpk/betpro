import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { EventsService } from '../../services/events.service';
import * as EventsActions from './events.actions';
import { Router } from '@angular/router';

@Injectable()
export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsService = inject(EventsService);
  private router = inject(Router);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      switchMap(({ filters, sort, pagination }) =>
        this.eventsService.getEvents(filters, sort, pagination).pipe(
          map(({ events, total }) => EventsActions.loadEventsSuccess({ events, total })),
          catchError((error) => of(EventsActions.loadEventsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvent),
      switchMap(({ id }) =>
        this.eventsService.getEvent(id).pipe(
          map((event) => EventsActions.loadEventSuccess({ event })),
          catchError((error) => of(EventsActions.loadEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  addEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.addEvent),
      switchMap(({ event }) =>
        this.eventsService.createEvent(event).pipe(
          map((createdEvent) => EventsActions.addEventSuccess({ event: createdEvent })),
          catchError((error) => of(EventsActions.addEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  addEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.addEventSuccess),
        tap(() => {
          this.router.navigate(['/events']);
        }),
      ),
    { dispatch: false },
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.updateEvent),
      switchMap(({ event }) =>
        this.eventsService.updateEvent(event).pipe(
          map((updatedEvent) => EventsActions.updateEventSuccess({ event: updatedEvent })),
          catchError((error) => of(EventsActions.updateEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.deleteEvent),
      switchMap(({ id }) =>
        this.eventsService.deleteEvent(id).pipe(
          map(() => EventsActions.deleteEventSuccess({ id })),
          catchError((error) => of(EventsActions.deleteEventFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
