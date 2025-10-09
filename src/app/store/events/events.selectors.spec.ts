import * as EventsSelectors from './events.selectors';
import { EventsState } from './events.reducer';
import { SportEvent } from '../../models/sport-event.model';

describe('Events Selectors', () => {
  const mockEvent1: SportEvent = {
    id: '1',
    title: 'Football Match',
    description: 'Test Description',
    sport: 'football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: new Date('2025-10-15'),
    status: 'upcoming',
    odds: { home: 2.0, draw: 3.0, away: 2.5 },
    isLive: false,
  };

  const mockEvent2: SportEvent = {
    id: '2',
    title: 'Basketball Game',
    description: 'Test Description',
    sport: 'basketball',
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    startTime: new Date('2025-10-20'),
    status: 'live',
    odds: { home: 1.8, away: 2.2 },
    isLive: true,
  };

  const mockEvent3: SportEvent = {
    id: '3',
    title: 'Tennis Match',
    description: 'Test Description',
    sport: 'tennis',
    homeTeam: 'Player A',
    awayTeam: 'Player B',
    startTime: new Date('2025-10-10'),
    status: 'finished',
    odds: { home: 1.5, away: 2.5 },
    isLive: false,
  };

  const initialState: EventsState = {
    allEvents: [mockEvent1, mockEvent2, mockEvent3],
    selectedEvent: null,
    filters: {},
    sort: { field: 'startTime', direction: 'asc' },
    pagination: { page: 1, pageSize: 10 },
    loading: false,
    error: null,
  };

  describe('selectFilteredEvents', () => {
    it('should return all events when no filters are applied', () => {
      const result = EventsSelectors.selectFilteredEvents.projector(
        initialState.allEvents,
        initialState.filters,
      );
      expect(result.length).toBe(3);
    });

    it('should filter events by sport', () => {
      const filters = { sport: 'football' as const };
      const result = EventsSelectors.selectFilteredEvents.projector(
        initialState.allEvents,
        filters,
      );
      expect(result.length).toBe(1);
      expect(result[0].sport).toBe('football');
    });

    it('should filter events by status', () => {
      const filters = { status: 'live' as const };
      const result = EventsSelectors.selectFilteredEvents.projector(
        initialState.allEvents,
        filters,
      );
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('live');
    });

    it('should filter events by date range', () => {
      const filters = {
        dateFrom: '2025-10-12T00:00:00.000Z',
        dateTo: '2025-10-18T00:00:00.000Z',
      };
      const result = EventsSelectors.selectFilteredEvents.projector(
        initialState.allEvents,
        filters,
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should apply multiple filters', () => {
      const filters = {
        sport: 'football' as const,
        status: 'upcoming' as const,
      };
      const result = EventsSelectors.selectFilteredEvents.projector(
        initialState.allEvents,
        filters,
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('selectSortedEvents', () => {
    it('should sort events by title ascending', () => {
      const sort = { field: 'title' as const, direction: 'asc' as const };
      const result = EventsSelectors.selectSortedEvents.projector(initialState.allEvents, sort);
      expect(result[0].title).toBe('Basketball Game');
      expect(result[1].title).toBe('Football Match');
      expect(result[2].title).toBe('Tennis Match');
    });

    it('should sort events by title descending', () => {
      const sort = { field: 'title' as const, direction: 'desc' as const };
      const result = EventsSelectors.selectSortedEvents.projector(initialState.allEvents, sort);
      expect(result[0].title).toBe('Tennis Match');
      expect(result[1].title).toBe('Football Match');
      expect(result[2].title).toBe('Basketball Game');
    });

    it('should sort events by startTime ascending', () => {
      const sort = { field: 'startTime' as const, direction: 'asc' as const };
      const result = EventsSelectors.selectSortedEvents.projector(initialState.allEvents, sort);
      expect(result[0].id).toBe('3'); // Oct 10
      expect(result[1].id).toBe('1'); // Oct 15
      expect(result[2].id).toBe('2'); // Oct 20
    });

    it('should sort events by sport', () => {
      const sort = { field: 'sport' as const, direction: 'asc' as const };
      const result = EventsSelectors.selectSortedEvents.projector(initialState.allEvents, sort);
      expect(result[0].sport).toBe('basketball');
      expect(result[1].sport).toBe('football');
      expect(result[2].sport).toBe('tennis');
    });
  });

  describe('selectAllEvents (with pagination)', () => {
    it('should return paginated events', () => {
      const pagination = { page: 1, pageSize: 2 };
      const result = EventsSelectors.selectAllEvents.projector(initialState.allEvents, pagination);
      expect(result.length).toBe(2);
    });

    it('should return second page of events', () => {
      const pagination = { page: 2, pageSize: 2 };
      const result = EventsSelectors.selectAllEvents.projector(initialState.allEvents, pagination);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('3');
    });

    it('should handle page size larger than total events', () => {
      const pagination = { page: 1, pageSize: 10 };
      const result = EventsSelectors.selectAllEvents.projector(initialState.allEvents, pagination);
      expect(result.length).toBe(3);
    });
  });

  describe('selectEventsTotal', () => {
    it('should return total count of filtered events', () => {
      const result = EventsSelectors.selectEventsTotal.projector(initialState.allEvents);
      expect(result).toBe(3);
    });

    it('should return filtered count', () => {
      const filteredEvents = [mockEvent1];
      const result = EventsSelectors.selectEventsTotal.projector(filteredEvents);
      expect(result).toBe(1);
    });
  });
});
