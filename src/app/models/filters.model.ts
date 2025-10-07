export interface EventFilters {
  sport?: 'football' | 'basketball' | 'tennis' | 'volleyball';
  status?: 'upcoming' | 'live' | 'finished';
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
