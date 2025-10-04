import { createAction, props } from '@ngrx/store';
import { SportEvent } from '../../models/sport-event.model';
import { EventFilters, EventSort, PaginationParams } from '../../models/filters.model';

// Load Events
export const loadEvents = createAction(
  '[Events] Load Events',
  props<{ filters?: EventFilters; sort?: EventSort; pagination?: PaginationParams }>()
);

export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: SportEvent[]; total: number }>()
);

export const loadEventsFailure = createAction(
  '[Events] Load Events Failure',
  props<{ error: string }>()
);

// Load Single Event
export const loadEvent = createAction('[Events] Load Event', props<{ id: string }>());

export const loadEventSuccess = createAction(
  '[Events] Load Event Success',
  props<{ event: SportEvent }>()
);

export const loadEventFailure = createAction(
  '[Events] Load Event Failure',
  props<{ error: string }>()
);

// Add Event
export const addEvent = createAction(
  '[Events] Add Event',
  props<{ event: Omit<SportEvent, 'id'> }>()
);

export const addEventSuccess = createAction(
  '[Events] Add Event Success',
  props<{ event: SportEvent }>()
);

export const addEventFailure = createAction(
  '[Events] Add Event Failure',
  props<{ error: string }>()
);

// Update Event
export const updateEvent = createAction('[Events] Update Event', props<{ event: SportEvent }>());

export const updateEventSuccess = createAction(
  '[Events] Update Event Success',
  props<{ event: SportEvent }>()
);

export const updateEventFailure = createAction(
  '[Events] Update Event Failure',
  props<{ error: string }>()
);

// Delete Event
export const deleteEvent = createAction('[Events] Delete Event', props<{ id: string }>());

export const deleteEventSuccess = createAction(
  '[Events] Delete Event Success',
  props<{ id: string }>()
);

export const deleteEventFailure = createAction(
  '[Events] Delete Event Failure',
  props<{ error: string }>()
);

// Update Odds (real-time)
export const updateOdds = createAction(
  '[Events] Update Odds',
  props<{ eventId: string; odds: { home: number; draw?: number; away: number } }>()
);

// Set Filters
export const setFilters = createAction('[Events] Set Filters', props<{ filters: EventFilters }>());

// Set Sort
export const setSort = createAction('[Events] Set Sort', props<{ sort: EventSort }>());

// Set Pagination
export const setPagination = createAction(
  '[Events] Set Pagination',
  props<{ pagination: PaginationParams }>()
);
