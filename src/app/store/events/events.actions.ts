import { createAction, props } from '@ngrx/store';
import { SportEvent } from '../../models/sport-event.model';
import { EventFilters, EventSort, PaginationParams } from '../../models/filters.model';

export const loadEvents = createAction('[Events] Load Events');

export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: SportEvent[] }>(),
);

export const loadEventsFailure = createAction(
  '[Events] Load Events Failure',
  props<{ error: string }>(),
);

export const loadEvent = createAction('[Events] Load Event', props<{ id: string }>());

export const loadEventSuccess = createAction(
  '[Events] Load Event Success',
  props<{ event: SportEvent }>(),
);

export const loadEventFailure = createAction(
  '[Events] Load Event Failure',
  props<{ error: string }>(),
);

export const addEvent = createAction(
  '[Events] Add Event',
  props<{ event: Omit<SportEvent, 'id'> }>(),
);

export const addEventSuccess = createAction(
  '[Events] Add Event Success',
  props<{ event: SportEvent }>(),
);

export const addEventFailure = createAction(
  '[Events] Add Event Failure',
  props<{ error: string }>(),
);

export const updateEvent = createAction('[Events] Update Event', props<{ event: SportEvent }>());

export const updateEventSuccess = createAction(
  '[Events] Update Event Success',
  props<{ event: SportEvent }>(),
);

export const updateEventFailure = createAction(
  '[Events] Update Event Failure',
  props<{ error: string }>(),
);

export const deleteEvent = createAction('[Events] Delete Event', props<{ id: string }>());

export const deleteEventSuccess = createAction(
  '[Events] Delete Event Success',
  props<{ id: string }>(),
);

export const deleteEventFailure = createAction(
  '[Events] Delete Event Failure',
  props<{ error: string }>(),
);

export const updateOdds = createAction(
  '[Events] Update Odds',
  props<{ eventId: string; odds: { home: number; draw?: number; away: number } }>(),
);

export const setFilters = createAction('[Events] Set Filters', props<{ filters: EventFilters }>());

export const setSort = createAction('[Events] Set Sort', props<{ sort: EventSort }>());

export const setPagination = createAction(
  '[Events] Set Pagination',
  props<{ pagination: PaginationParams }>(),
);
