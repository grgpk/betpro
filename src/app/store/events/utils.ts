import { EventFilters, EventSort, PaginationParams } from '../../models/filters.model';
import { EventsState } from './events.reducer';

interface StoredEventsState {
  filters: EventFilters;
  sort: EventSort;
  pagination: PaginationParams;
}

export function loadFromLocalStorage(key: string): Partial<EventsState> {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed: StoredEventsState = JSON.parse(stored);
      return {
        filters: parsed.filters || {},
        sort: parsed.sort || { field: 'startTime', direction: 'asc' },
        pagination: parsed.pagination || { page: 1, pageSize: 10 },
      };
    }
  } catch (error) {
    console.error('Error loading events state from localStorage:', error);
  }
  return {};
}

export function saveToLocalStorage(key: string, state: EventsState): void {
  try {
    const toStore: StoredEventsState = {
      filters: state.filters,
      sort: state.sort,
      pagination: state.pagination,
    };
    localStorage.setItem(key, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving events state to localStorage:', error);
  }
}
