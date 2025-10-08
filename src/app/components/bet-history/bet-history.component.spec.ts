import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetHistoryComponent } from './bet-history.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as BetHistoryActions from '../../store/bet-history/bet-history.actions';
import {
  selectBetHistory,
  selectPendingBets,
  selectSettledBets,
  selectTotalWinnings,
  selectTotalLosses,
  selectNetProfit,
  selectBetHistoryLoading,
} from '../../store/bet-history/bet-history.selectors';

describe('BetHistoryComponent', () => {
  let component: BetHistoryComponent;
  let fixture: ComponentFixture<BetHistoryComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetHistoryComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectBetHistory, value: [] },
            { selector: selectPendingBets, value: [] },
            { selector: selectSettledBets, value: [] },
            { selector: selectTotalWinnings, value: 0 },
            { selector: selectTotalLosses, value: 0 },
            { selector: selectNetProfit, value: 0 },
            { selector: selectBetHistoryLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BetHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadBetHistory on init', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(BetHistoryActions.loadBetHistory());
  });

  it('should dispatch deleteBetFromHistory when deleteBet is called and confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteBet('bet-123');

    expect(store.dispatch).toHaveBeenCalledWith(
      BetHistoryActions.deleteBetFromHistory({ betId: 'bet-123' }),
    );
  });

  it('should not dispatch deleteBetFromHistory when deletion is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const dispatchSpy = store.dispatch as jasmine.Spy;
    dispatchSpy.calls.reset();

    component.deleteBet('bet-123');

    expect(store.dispatch).not.toHaveBeenCalledWith(
      BetHistoryActions.deleteBetFromHistory({ betId: 'bet-123' }),
    );
  });

  it('should dispatch clearBetHistory when clearHistory is called and confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.clearHistory();

    expect(store.dispatch).toHaveBeenCalledWith(BetHistoryActions.clearBetHistory());
  });

  it('should not dispatch clearBetHistory when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const dispatchSpy = store.dispatch as jasmine.Spy;
    dispatchSpy.calls.reset();

    component.clearHistory();

    expect(store.dispatch).not.toHaveBeenCalledWith(BetHistoryActions.clearBetHistory());
  });
});
