import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './events.reducer';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectAllEvents = createSelector(selectEventsState, (state) => state.events);

export const selectSelectedEvent = createSelector(
  selectEventsState,
  (state) => state.selectedEvent
);

export const selectEventsLoading = createSelector(selectEventsState, (state) => state.loading);

export const selectEventsError = createSelector(selectEventsState, (state) => state.error);

export const selectEventsFilters = createSelector(selectEventsState, (state) => state.filters);

export const selectEventsSort = createSelector(selectEventsState, (state) => state.sort);

export const selectEventsPagination = createSelector(
  selectEventsState,
  (state) => state.pagination
);

export const selectEventsTotal = createSelector(selectEventsState, (state) => state.total);
