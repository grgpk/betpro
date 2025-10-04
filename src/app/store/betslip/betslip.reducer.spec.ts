import { betslipReducer, BetslipState } from './betslip.reducer';
import * as BetslipActions from './betslip.actions';
import { Bet } from '../../models/bet.model';

describe('Betslip Reducer', () => {
  const initialState: BetslipState = {
    bets: [],
    loading: false,
    error: null,
  };

  const mockBet: Bet = {
    id: '1-home',
    eventId: '1',
    eventTitle: 'Test Event',
    selection: 'home',
    odds: 2.0,
    stake: 10,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = betslipReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should add bet to betslip', () => {
    const action = BetslipActions.addToBetslip({ bet: mockBet });
    const state = betslipReducer(initialState, action);

    expect(state.bets.length).toBe(1);
    expect(state.bets[0]).toEqual(mockBet);
  });

  it('should replace existing bet for same event', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
    };

    const newBet: Bet = {
      ...mockBet,
      selection: 'away',
      odds: 2.5,
    };

    const action = BetslipActions.addToBetslip({ bet: newBet });
    const state = betslipReducer(stateWithBet, action);

    expect(state.bets.length).toBe(1);
    expect(state.bets[0].selection).toBe('away');
    expect(state.bets[0].odds).toBe(2.5);
  });

  it('should remove bet from betslip', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
    };

    const action = BetslipActions.removeFromBetslip({ betId: '1-home' });
    const state = betslipReducer(stateWithBet, action);

    expect(state.bets.length).toBe(0);
  });

  it('should update stake', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
    };

    const action = BetslipActions.updateStake({ betId: '1-home', stake: 20 });
    const state = betslipReducer(stateWithBet, action);

    expect(state.bets[0].stake).toBe(20);
  });

  it('should clear betslip', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
    };

    const action = BetslipActions.clearBetslip();
    const state = betslipReducer(stateWithBet, action);

    expect(state.bets.length).toBe(0);
  });

  it('should load betslip from storage', () => {
    const storedBets = [mockBet];
    localStorage.setItem('betslip', JSON.stringify(storedBets));

    const action = BetslipActions.loadBetslipFromStorage();
    const state = betslipReducer(initialState, action);

    expect(state.bets.length).toBe(1);
    expect(state.bets[0]).toEqual(mockBet);
  });

  it('should handle place bet', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
    };

    const action = BetslipActions.placeBet();
    const state = betslipReducer(stateWithBet, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should clear betslip on place bet success', () => {
    const stateWithBet: BetslipState = {
      ...initialState,
      bets: [mockBet],
      loading: true,
    };

    const action = BetslipActions.placeBetSuccess();
    const state = betslipReducer(stateWithBet, action);

    expect(state.bets.length).toBe(0);
    expect(state.loading).toBe(false);
  });
});
