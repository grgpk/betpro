import type { Sport, EventStatus } from '../components/event-list/types';

export interface EventFilters {
  sport?: Sport;
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface EventSort {
  field: 'title' | 'startTime' | 'sport' | 'status';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
