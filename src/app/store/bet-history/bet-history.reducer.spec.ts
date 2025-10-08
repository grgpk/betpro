import { betHistoryReducer, BetHistoryState } from './bet-history.reducer';
import * as BetHistoryActions from './bet-history.actions';
import { BetHistoryItem } from '../../models/bet-history.model';

describe('BetHistoryReducer', () => {
  const initialState: BetHistoryState = {
    history: [],
    loading: false,
    error: null,
  };

  const mockBet: BetHistoryItem = {
    id: '1',
    bets: [
      {
        id: 'bet-1',
        eventId: 'event-1',
        eventTitle: 'Test Match',
        selection: 'home',
        odds: 2.5,
        stake: 50,
      },
    ],
    totalStake: 50,
    totalOdds: 2.5,
    potentialWin: 125,
    status: 'pending',
    placedAt: new Date(),
  };

  it('should return initial state', () => {
    const state = betHistoryReducer(undefined, { type: 'unknown' });

    expect(state).toEqual(initialState);
  });

  it('should set loading on loadBetHistory', () => {
    const state = betHistoryReducer(initialState, BetHistoryActions.loadBetHistory());

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should load bet history on success', () => {
    const history = [mockBet];
    const state = betHistoryReducer(
      initialState,
      BetHistoryActions.loadBetHistorySuccess({ history }),
    );

    expect(state.history).toEqual(history);
    expect(state.loading).toBe(false);
  });

  it('should add bet to history', () => {
    const state = betHistoryReducer(
      initialState,
      BetHistoryActions.addBetToHistory({ bet: mockBet }),
    );

    expect(state.history).toContain(mockBet);
    expect(state.history.length).toBe(1);
  });

  it('should delete bet from history on success', () => {
    const stateWithBet: BetHistoryState = {
      ...initialState,
      history: [mockBet],
    };

    const state = betHistoryReducer(
      stateWithBet,
      BetHistoryActions.deleteBetFromHistorySuccess({ betId: '1' }),
    );

    expect(state.history.length).toBe(0);
    expect(state.loading).toBe(false);
  });

  it('should clear bet history', () => {
    const stateWithBets: BetHistoryState = {
      ...initialState,
      history: [mockBet],
    };

    const state = betHistoryReducer(stateWithBets, BetHistoryActions.clearBetHistory());

    expect(state.history).toEqual([]);
  });

  it('should set error on failure', () => {
    const error = 'Failed to load';
    const state = betHistoryReducer(
      initialState,
      BetHistoryActions.loadBetHistoryFailure({ error }),
    );

    expect(state.error).toBe(error);
    expect(state.loading).toBe(false);
  });
});
