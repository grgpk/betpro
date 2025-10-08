import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { BetHistoryTabsComponent } from './bet-history-tabs.component';
import { BetHistoryItem } from '../../../models/bet-history.model';

describe('BetHistoryTabsComponent', () => {
  let component: BetHistoryTabsComponent;
  let fixture: ComponentFixture<BetHistoryTabsComponent>;
  let componentRef: ComponentRef<BetHistoryTabsComponent>;

  const mockBet: BetHistoryItem = {
    id: '1',
    bets: [
      {
        id: 'bet-1',
        eventId: 'evt-1',
        eventTitle: 'Team A vs Team B',
        selection: 'home',
        odds: 2.5,
        stake: 100,
      },
    ],
    totalStake: 100,
    totalOdds: 2.5,
    potentialWin: 250,
    placedAt: new Date('2025-10-01'),
    status: 'pending',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetHistoryTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetHistoryTabsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('allBets', []);
    componentRef.setInput('pendingBets', []);
    componentRef.setInput('settledBets', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept required inputs', () => {
    componentRef.setInput('allBets', [mockBet]);
    componentRef.setInput('pendingBets', [mockBet]);
    componentRef.setInput('settledBets', []);
    fixture.detectChanges();

    expect(component.allBets()).toEqual([mockBet]);
    expect(component.pendingBets()).toEqual([mockBet]);
    expect(component.settledBets()).toEqual([]);
  });

  it('should emit deleteBet event when onDeleteBet is called', () => {
    componentRef.setInput('allBets', []);
    componentRef.setInput('pendingBets', []);
    componentRef.setInput('settledBets', []);
    fixture.detectChanges();

    const deleteSpy = jasmine.createSpy('deleteBet');
    component.deleteBet.subscribe(deleteSpy);

    component.onDeleteBet('bet-123');

    expect(deleteSpy).toHaveBeenCalledWith('bet-123');
  });
});
