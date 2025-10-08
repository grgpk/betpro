import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Bet } from '../../models/bet.model';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import {
  selectBetslipBets,
  selectBetslipCount,
  selectBetslipPotentialWin,
  selectBetslipTotalOdds,
  selectBetslipTotalStake,
} from '../../store/betslip/betslip.selectors';
import { BetslipComponent } from './betslip.component';

describe('BetslipComponent', () => {
  let component: BetslipComponent;
  let fixture: ComponentFixture<BetslipComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetslipComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectBetslipBets, value: [] },
            { selector: selectBetslipCount, value: 0 },
            { selector: selectBetslipTotalOdds, value: 0 },
            { selector: selectBetslipTotalStake, value: 0 },
            { selector: selectBetslipPotentialWin, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BetslipComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch updateStake when onStakeUpdated is called', () => {
    component.onStakeUpdated({ betId: 'bet-1', stake: 200 });

    expect(store.dispatch).toHaveBeenCalledWith(
      BetslipActions.updateStake({ betId: 'bet-1', stake: 200 }),
    );
  });

  it('should dispatch removeFromBetslip and show snackbar when onBetRemoved is called', () => {
    spyOn(MatSnackBar.prototype, 'open');
    component.onBetRemoved('bet-1');

    expect(store.dispatch).toHaveBeenCalledWith(
      BetslipActions.removeFromBetslip({ betId: 'bet-1' }),
    );
    expect(MatSnackBar.prototype.open).toHaveBeenCalledTimes(1);
    expect(MatSnackBar.prototype.open).toHaveBeenCalledWith('Removed from betslip', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  });

  it('should not dispatch clearBetslip when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const dispatchSpy = store.dispatch as jasmine.Spy;
    dispatchSpy.calls.reset();

    component.onClearBetslip();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should show warning when onPlaceBet is called without stakes', () => {
    const betsWithoutStakes: Bet[] = [
      {
        id: 'bet-1',
        eventId: 'evt-1',
        eventTitle: 'Team A vs Team B',
        selection: 'home',
        odds: 2.5,
      },
    ];

    spyOn(MatSnackBar.prototype, 'open');

    store.overrideSelector(selectBetslipBets, betsWithoutStakes);
    store.refreshState();
    component.onPlaceBet();

    expect(MatSnackBar.prototype.open).toHaveBeenCalledTimes(1);
    expect(MatSnackBar.prototype.open).toHaveBeenCalledWith(
      'Please enter stake amounts for all bets',
      'Close',
      {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      },
    );
  });
});
