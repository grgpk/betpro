import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './events.reducer';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectAllEventsRaw = createSelector(selectEventsState, (state) => state.allEvents);

export const selectSelectedEvent = createSelector(
  selectEventsState,
  (state) => state.selectedEvent,
);

export const selectEventsLoading = createSelector(selectEventsState, (state) => state.loading);

export const selectEventsError = createSelector(selectEventsState, (state) => state.error);

export const selectEventsFilters = createSelector(selectEventsState, (state) => state.filters);

export const selectEventsSort = createSelector(selectEventsState, (state) => state.sort);

export const selectEventsPagination = createSelector(
  selectEventsState,
  (state) => state.pagination,
);

export const selectFilteredEvents = createSelector(
  selectAllEventsRaw,
  selectEventsFilters,
  (events, filters) => {
    let filtered = [...events];

    if (filters.sport) {
      filtered = filtered.filter((event) => event.sport === filters.sport);
    }

    if (filters.status) {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter((event) => event.startTime >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      filtered = filtered.filter((event) => event.startTime <= dateTo);
    }

    return filtered;
  },
);

export const selectSortedEvents = createSelector(
  selectFilteredEvents,
  selectEventsSort,
  (events, sort) => {
    const sorted = [...events];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'sport':
          comparison = a.sport.localeCompare(b.sport);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'startTime':
          comparison = a.startTime.getTime() - b.startTime.getTime();
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  },
);

export const selectEventsTotal = createSelector(selectFilteredEvents, (events) => events.length);

export const selectAllEvents = createSelector(
  selectSortedEvents,
  selectEventsPagination,
  (events, pagination) => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return events.slice(startIndex, endIndex);
  },
);
