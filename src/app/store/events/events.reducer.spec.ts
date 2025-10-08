import { eventsReducer, EventsState } from './events.reducer';
import * as EventsActions from './events.actions';
import { SportEvent } from '../../models/sport-event.model';

describe('Events Reducer', () => {
  const initialState: EventsState = {
    events: [],
    selectedEvent: null,
    filters: {},
    sort: { field: 'startTime', direction: 'asc' },
    pagination: { page: 1, pageSize: 10 },
    total: 0,
    loading: false,
    error: null,
  };

  const mockEvent: SportEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    sport: 'football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: new Date(),
    status: 'upcoming',
    odds: { home: 2.0, draw: 3.0, away: 2.5 },
    isLive: false,
  };

  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = eventsReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should set loading to true when loading events', () => {
    const action = EventsActions.loadEvents({});
    const state = eventsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should load events successfully', () => {
    const action = EventsActions.loadEventsSuccess({
      events: [mockEvent],
      total: 1,
    });
    const state = eventsReducer(initialState, action);

    expect(state.events.length).toBe(1);
    expect(state.total).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle load events failure', () => {
    const action = EventsActions.loadEventsFailure({ error: 'Error message' });
    const state = eventsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error message');
  });

  it('should add event successfully', () => {
    const action = EventsActions.addEventSuccess({ event: mockEvent });
    const state = eventsReducer(initialState, action);

    expect(state.events.length).toBe(1);
    expect(state.total).toBe(1);
    expect(state.loading).toBe(false);
  });

  it('should update event successfully', () => {
    const stateWithEvent: EventsState = {
      ...initialState,
      events: [mockEvent],
    };

    const updatedEvent = { ...mockEvent, title: 'Updated Title' };
    const action = EventsActions.updateEventSuccess({ event: updatedEvent });
    const state = eventsReducer(stateWithEvent, action);

    expect(state.events[0].title).toBe('Updated Title');
  });

  it('should delete event successfully', () => {
    const stateWithEvent: EventsState = {
      ...initialState,
      events: [mockEvent],
      total: 1,
    };

    const action = EventsActions.deleteEventSuccess({ id: '1' });
    const state = eventsReducer(stateWithEvent, action);

    expect(state.events.length).toBe(0);
    expect(state.total).toBe(0);
  });

  it('should update odds', () => {
    const stateWithEvent: EventsState = {
      ...initialState,
      events: [mockEvent],
    };

    const newOdds = { home: 2.5, draw: 3.5, away: 2.8 };
    const action = EventsActions.updateOdds({ eventId: '1', odds: newOdds });
    const state = eventsReducer(stateWithEvent, action);

    expect(state.events[0].odds.home).toBe(2.5);
    expect(state.events[0].odds.draw).toBe(3.5);
    expect(state.events[0].odds.away).toBe(2.8);
  });

  it('should set filters', () => {
    const filters = { sport: 'football' as const };
    const action = EventsActions.setFilters({ filters });
    const state = eventsReducer(initialState, action);

    expect(state.filters.sport).toBe('football');
    expect(state.pagination.page).toBe(1); // Should reset to first page
  });
});
