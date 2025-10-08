import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { BetListComponent } from './bet-list.component';
import { Bet } from '../../../models/bet.model';

describe('BetListComponent', () => {
  let component: BetListComponent;
  let fixture: ComponentFixture<BetListComponent>;
  let componentRef: ComponentRef<BetListComponent>;

  const mockBets: Bet[] = [
    {
      id: 'bet-1',
      eventId: 'evt-1',
      eventTitle: 'Team A vs Team B',
      selection: 'home',
      odds: 2.5,
      stake: 100,
    },
    {
      id: 'bet-2',
      eventId: 'evt-2',
      eventTitle: 'Team C vs Team D',
      selection: 'draw',
      odds: 3.0,
      stake: 50,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('bets', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept bets input', () => {
    componentRef.setInput('bets', mockBets);
    fixture.detectChanges();

    expect(component.bets()).toEqual(mockBets);
  });

  it('should create stake control for a bet', () => {
    componentRef.setInput('bets', mockBets);
    fixture.detectChanges();

    const control = component.getStakeControl('bet-1');

    expect(control).toBeDefined();
    expect(control.value).toBe(100);
  });

  it('should emit stakeUpdated when onStakeChange is called', () => {
    componentRef.setInput('bets', mockBets);
    fixture.detectChanges();

    const stakeUpdatedSpy = jasmine.createSpy('stakeUpdated');
    component.stakeUpdated.subscribe(stakeUpdatedSpy);

    component.onStakeChange('bet-1', 200);

    expect(stakeUpdatedSpy).toHaveBeenCalledWith({ betId: 'bet-1', stake: 200 });
  });

  it('should emit betRemoved when onRemoveBet is called', () => {
    componentRef.setInput('bets', mockBets);
    fixture.detectChanges();

    const betRemovedSpy = jasmine.createSpy('betRemoved');
    component.betRemoved.subscribe(betRemovedSpy);

    component.onRemoveBet('bet-1');

    expect(betRemovedSpy).toHaveBeenCalledWith('bet-1');
  });

  it('should remove stake control when onRemoveBet is called', () => {
    componentRef.setInput('bets', mockBets);
    fixture.detectChanges();

    component.getStakeControl('bet-1');
    expect(component.stakeControls.has('bet-1')).toBe(true);

    component.onRemoveBet('bet-1');

    expect(component.stakeControls.has('bet-1')).toBe(false);
  });
});
