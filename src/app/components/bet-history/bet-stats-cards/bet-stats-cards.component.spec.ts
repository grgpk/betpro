import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { BetStatsCardsComponent, BetStats } from './bet-stats-cards.component';

describe('BetStatsCardsComponent', () => {
  let component: BetStatsCardsComponent;
  let fixture: ComponentFixture<BetStatsCardsComponent>;
  let componentRef: ComponentRef<BetStatsCardsComponent>;

  const mockStats: BetStats = {
    totalBets: 10,
    winnings: 500,
    losses: 200,
    netProfit: 300,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetStatsCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetStatsCardsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('stats', mockStats);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept stats input', () => {
    componentRef.setInput('stats', mockStats);
    fixture.detectChanges();

    expect(component.stats()).toEqual(mockStats);
  });

  it('should handle zero values in stats', () => {
    const zeroStats: BetStats = {
      totalBets: 0,
      winnings: 0,
      losses: 0,
      netProfit: 0,
    };

    componentRef.setInput('stats', zeroStats);
    fixture.detectChanges();

    expect(component.stats()).toEqual(zeroStats);
  });
});
