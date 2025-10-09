import { createReducer, on } from '@ngrx/store';
import { SportEvent } from '../../models/sport-event.model';
import { EventFilters, EventSort, PaginationParams } from '../../models/filters.model';
import * as EventsActions from './events.actions';

export interface EventsState {
  allEvents: SportEvent[];
  selectedEvent: SportEvent | null;
  filters: EventFilters;
  sort: EventSort;
  pagination: PaginationParams;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  allEvents: [],
  selectedEvent: null,
  filters: {},
  sort: { field: 'startTime', direction: 'asc' },
  pagination: { page: 1, pageSize: 10 },
  loading: false,
  error: null,
};

export const eventsReducer = createReducer(
  initialState,

  on(EventsActions.loadEvents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    allEvents: events,
    loading: false,
    error: null,
  })),

  on(EventsActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EventsActions.loadEvent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.loadEventSuccess, (state, { event }) => ({
    ...state,
    selectedEvent: event,
    loading: false,
    error: null,
  })),

  on(EventsActions.loadEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EventsActions.addEvent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.addEventSuccess, (state, { event }) => ({
    ...state,
    allEvents: [...state.allEvents, event],
    loading: false,
    error: null,
  })),

  on(EventsActions.addEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EventsActions.updateEvent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.updateEventSuccess, (state, { event }) => ({
    ...state,
    allEvents: state.allEvents.map((e) => (e.id === event.id ? event : e)),
    selectedEvent: state.selectedEvent?.id === event.id ? event : state.selectedEvent,
    loading: false,
    error: null,
  })),

  on(EventsActions.updateEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EventsActions.deleteEvent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EventsActions.deleteEventSuccess, (state, { id }) => ({
    ...state,
    allEvents: state.allEvents.filter((e) => e.id !== id),
    loading: false,
    error: null,
  })),

  on(EventsActions.deleteEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EventsActions.updateOdds, (state, { eventId, odds }) => ({
    ...state,
    allEvents: state.allEvents.map((e) => (e.id === eventId ? { ...e, odds } : e)),
    selectedEvent:
      state.selectedEvent?.id === eventId ? { ...state.selectedEvent, odds } : state.selectedEvent,
  })),

  on(EventsActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
    pagination: { ...state.pagination, page: 1 },
  })),

  on(EventsActions.setSort, (state, { sort }) => ({
    ...state,
    sort,
  })),

  on(EventsActions.setPagination, (state, { pagination }) => ({
    ...state,
    pagination,
  })),
);
