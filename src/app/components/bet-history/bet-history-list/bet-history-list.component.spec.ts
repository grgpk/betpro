import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BetHistoryListComponent } from './bet-history-list.component';
import { BetHistoryItem } from '../../../models/bet-history.model';

describe('BetHistoryListComponent', () => {
  let component: BetHistoryListComponent;
  let componentRef: ComponentRef<BetHistoryListComponent>;
  let fixture: ComponentFixture<BetHistoryListComponent>;

  const mockBetHistoryItems: BetHistoryItem[] = [
    {
      id: 'bet-1',
      bets: [
        {
          id: 'bet-1-event-1',
          eventId: 'event-1',
          eventTitle: 'Manchester United vs Liverpool',
          selection: 'home',
          odds: 2.5,
          stake: 50,
        },
        {
          id: 'bet-1-event-2',
          eventId: 'event-2',
          eventTitle: 'Chelsea vs Arsenal',
          selection: 'away',
          odds: 3.0,
          stake: 50,
        },
      ],
      totalStake: 100,
      totalOdds: 7.5,
      potentialWin: 750,
      status: 'won',
      actualWin: 750,
      placedAt: new Date('2025-10-01T10:00:00'),
      settledAt: new Date('2025-10-01T18:00:00'),
    },
    {
      id: 'bet-2',
      bets: [
        {
          id: 'bet-2-event-1',
          eventId: 'event-3',
          eventTitle: 'Real Madrid vs Barcelona',
          selection: 'draw',
          odds: 3.5,
          stake: 25,
        },
      ],
      totalStake: 25,
      totalOdds: 3.5,
      potentialWin: 87.5,
      status: 'pending',
      placedAt: new Date('2025-10-05T14:30:00'),
    },
    {
      id: 'bet-3',
      bets: [
        {
          id: 'bet-3-event-1',
          eventId: 'event-4',
          eventTitle: 'Lakers vs Warriors',
          selection: 'home',
          odds: 1.8,
          stake: 100,
        },
      ],
      totalStake: 100,
      totalOdds: 1.8,
      potentialWin: 180,
      status: 'lost',
      placedAt: new Date('2025-10-03T20:00:00'),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BetHistoryListComponent,
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        DatePipe,
        TitleCasePipe,
        UpperCasePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BetHistoryListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('bets', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have required bets input', () => {
      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();
      expect(component.bets()).toEqual(mockBetHistoryItems);
    });

    it('should have default emptyIcon', () => {
      componentRef.setInput('bets', []);
      fixture.detectChanges();
      expect(component.emptyIcon()).toBe('history');
    });

    it('should allow custom emptyIcon', () => {
      componentRef.setInput('bets', []);
      componentRef.setInput('emptyIcon', 'event_busy');
      fixture.detectChanges();
      expect(component.emptyIcon()).toBe('event_busy');
    });

    it('should have default emptyMessage', () => {
      componentRef.setInput('bets', []);
      fixture.detectChanges();
      expect(component.emptyMessage()).toBe('No bets in history yet');
    });

    it('should allow custom emptyMessage', () => {
      componentRef.setInput('bets', []);
      componentRef.setInput('emptyMessage', 'No pending bets');
      fixture.detectChanges();
      expect(component.emptyMessage()).toBe('No pending bets');
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      componentRef.setInput('bets', []);
      fixture.detectChanges();
    });

    it('should show empty state when bets array is empty', () => {
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });

    it('should display empty icon', () => {
      const icon = fixture.debugElement.query(By.css('.empty-state mat-icon'));
      expect(icon.nativeElement.textContent.trim()).toBe('history');
    });

    it('should display empty message', () => {
      const message = fixture.debugElement.query(By.css('.empty-state p'));
      expect(message.nativeElement.textContent.trim()).toBe('No bets in history yet');
    });

    it('should display custom empty icon', () => {
      componentRef.setInput('emptyIcon', 'sports_soccer');
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.empty-state mat-icon'));
      expect(icon.nativeElement.textContent.trim()).toBe('sports_soccer');
    });

    it('should display custom empty message', () => {
      componentRef.setInput('emptyMessage', 'Start betting to see your history');
      fixture.detectChanges();
      const message = fixture.debugElement.query(By.css('.empty-state p'));
      expect(message.nativeElement.textContent.trim()).toBe('Start betting to see your history');
    });

    it('should not show bet cards when empty', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      expect(betCards.length).toBe(0);
    });
  });

  describe('Bet Cards Rendering', () => {
    beforeEach(() => {
      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();
    });

    it('should not show empty state when bets exist', () => {
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeFalsy();
    });

    it('should render correct number of bet cards', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      expect(betCards.length).toBe(3);
    });

    it('should display bet ID', () => {
      const betIds = fixture.debugElement.queryAll(By.css('.bet-id'));
      expect(betIds[0].nativeElement.textContent).toContain('Bet #bet-1');
      expect(betIds[1].nativeElement.textContent).toContain('Bet #bet-2');
      expect(betIds[2].nativeElement.textContent).toContain('Bet #bet-3');
    });

    it('should display placed date for each bet', () => {
      const dates = fixture.debugElement.queryAll(By.css('.placed-date span'));
      expect(dates.length).toBe(3);
      expect(dates[0].nativeElement.textContent).toBeTruthy();
    });

    it('should display individual bets within each card', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const firstCardBets = betCards[0].queryAll(By.css('.individual-bet'));
      expect(firstCardBets.length).toBe(2); // First bet has 2 individual bets
    });

    it('should display event title for individual bets', () => {
      const eventTitles = fixture.debugElement.queryAll(By.css('.individual-bet strong'));
      expect(eventTitles[0].nativeElement.textContent).toBe('Manchester United vs Liverpool');
      expect(eventTitles[1].nativeElement.textContent).toBe('Chelsea vs Arsenal');
    });

    it('should display selection with titlecase pipe', () => {
      const selections = fixture.debugElement.queryAll(By.css('.selection'));
      expect(selections[0].nativeElement.textContent).toBe('Home');
      expect(selections[1].nativeElement.textContent).toBe('Away');
    });

    it('should display odds for individual bets', () => {
      const odds = fixture.debugElement.queryAll(By.css('.odds'));
      expect(odds[0].nativeElement.textContent).toBe('2.5');
      expect(odds[1].nativeElement.textContent).toBe('3');
    });

    it('should display stake for individual bets', () => {
      const stakes = fixture.debugElement.queryAll(By.css('.stake'));
      expect(stakes[0].nativeElement.textContent).toBe('$50');
      expect(stakes[1].nativeElement.textContent).toBe('$50');
    });

    it('should display total stake', () => {
      const totalStakes = fixture.debugElement.queryAll(By.css('.summary-row strong'));
      const firstBetTotalStake = totalStakes[0].nativeElement.textContent;
      expect(firstBetTotalStake).toBe('$100.00');
    });

    it('should display total odds', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const summaryRows = betCards[0].queryAll(By.css('.summary-row'));
      const totalOddsRow = summaryRows[1].query(By.css('strong'));
      expect(totalOddsRow.nativeElement.textContent).toBe('7.50');
    });

    it('should display potential win', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const potentialWin = betCards[0].query(By.css('.potential'));
      expect(potentialWin.nativeElement.textContent).toBe('$750.00');
    });

    it('should display actual win for won bets', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const wonRow = betCards[0].query(By.css('.summary-row.won strong'));
      expect(wonRow).toBeTruthy();
      expect(wonRow.nativeElement.textContent).toBe('$750.00');
    });

    it('should not display actual win for pending bets', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const wonRow = betCards[1].query(By.css('.summary-row.won'));
      expect(wonRow).toBeFalsy();
    });

    it('should not display actual win for lost bets', () => {
      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      const wonRow = betCards[2].query(By.css('.summary-row.won'));
      expect(wonRow).toBeFalsy();
    });
  });

  describe('Status Display', () => {
    beforeEach(() => {
      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();
    });

    it('should display status chips', () => {
      const statusChips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(statusChips.length).toBe(3);
    });

    it('should display status in uppercase', () => {
      const statusChips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(statusChips[0].nativeElement.textContent.trim()).toBe('WON');
      expect(statusChips[1].nativeElement.textContent.trim()).toBe('PENDING');
      expect(statusChips[2].nativeElement.textContent.trim()).toBe('LOST');
    });

    it('should apply correct status class for won bets', () => {
      const statusChips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(statusChips[0].nativeElement.classList.contains('status-won')).toBe(true);
    });

    it('should apply correct status class for pending bets', () => {
      const statusChips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(statusChips[1].nativeElement.classList.contains('status-pending')).toBe(true);
    });

    it('should apply correct status class for lost bets', () => {
      const statusChips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(statusChips[2].nativeElement.classList.contains('status-lost')).toBe(true);
    });
  });

  describe('getStatusClass method', () => {
    beforeEach(() => {
      componentRef.setInput('bets', []);
      fixture.detectChanges();
    });

    it('should return status-pending for pending status', () => {
      expect(component.getStatusClass('pending')).toBe('status-pending');
    });

    it('should return status-won for won status', () => {
      expect(component.getStatusClass('won')).toBe('status-won');
    });

    it('should return status-lost for lost status', () => {
      expect(component.getStatusClass('lost')).toBe('status-lost');
    });

    it('should return status-void for void status', () => {
      expect(component.getStatusClass('void')).toBe('status-void');
    });

    it('should return empty string for unknown status', () => {
      expect(component.getStatusClass('unknown')).toBe('');
    });
  });

  describe('Delete Button', () => {
    beforeEach(() => {
      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();
    });

    it('should display delete button for each bet', () => {
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('.bet-card-header button[mat-icon-button]'),
      );
      expect(deleteButtons.length).toBe(3);
    });

    it('should have delete icon in delete button', () => {
      const deleteIcons = fixture.debugElement.queryAll(By.css('.bet-card-header button mat-icon'));
      expect(deleteIcons[0].nativeElement.textContent.trim()).toBe('delete');
    });

    it('should emit deleteBet event when delete button is clicked', () => {
      spyOn(component.deleteBet, 'emit');
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('.bet-card-header button[mat-icon-button]'),
      );

      deleteButtons[0].nativeElement.click();

      expect(component.deleteBet.emit).toHaveBeenCalledWith('bet-1');
    });

    it('should emit correct bet ID when different delete buttons are clicked', () => {
      spyOn(component.deleteBet, 'emit');
      const deleteButtons = fixture.debugElement.queryAll(
        By.css('.bet-card-header button[mat-icon-button]'),
      );

      deleteButtons[1].nativeElement.click();
      expect(component.deleteBet.emit).toHaveBeenCalledWith('bet-2');

      deleteButtons[2].nativeElement.click();
      expect(component.deleteBet.emit).toHaveBeenCalledWith('bet-3');
    });
  });

  describe('onDeleteBet method', () => {
    beforeEach(() => {
      componentRef.setInput('bets', []);
      fixture.detectChanges();
    });

    it('should emit deleteBet output with correct betId', () => {
      spyOn(component.deleteBet, 'emit');
      component.onDeleteBet('test-bet-id');
      expect(component.deleteBet.emit).toHaveBeenCalledWith('test-bet-id');
    });

    it('should emit deleteBet output only once per call', () => {
      spyOn(component.deleteBet, 'emit');
      component.onDeleteBet('bet-123');
      expect(component.deleteBet.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle bet with no individual bets', () => {
      const emptyBet: BetHistoryItem = {
        id: 'bet-empty',
        bets: [],
        totalStake: 0,
        totalOdds: 0,
        potentialWin: 0,
        status: 'pending',
        placedAt: new Date(),
      };

      componentRef.setInput('bets', [emptyBet]);
      fixture.detectChanges();

      const betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      expect(betCards.length).toBe(1);

      const individualBets = betCards[0].queryAll(By.css('.individual-bet'));
      expect(individualBets.length).toBe(0);
    });

    it('should handle bet with zero stake', () => {
      const zeroStakeBet: BetHistoryItem = {
        id: 'bet-zero',
        bets: [
          {
            id: 'bet-zero-1',
            eventId: 'event-1',
            eventTitle: 'Test Match',
            selection: 'home',
            odds: 2.0,
            stake: 0,
          },
        ],
        totalStake: 0,
        totalOdds: 2.0,
        potentialWin: 0,
        status: 'pending',
        placedAt: new Date(),
      };

      componentRef.setInput('bets', [zeroStakeBet]);
      fixture.detectChanges();

      const stake = fixture.debugElement.query(By.css('.stake'));
      expect(stake.nativeElement.textContent).toBe('$0');
    });

    it('should handle bet with undefined stake', () => {
      const undefinedStakeBet: BetHistoryItem = {
        id: 'bet-undefined',
        bets: [
          {
            id: 'bet-undefined-1',
            eventId: 'event-1',
            eventTitle: 'Test Match',
            selection: 'home',
            odds: 2.0,
            // stake is undefined
          },
        ],
        totalStake: 0,
        totalOdds: 2.0,
        potentialWin: 0,
        status: 'pending',
        placedAt: new Date(),
      };

      componentRef.setInput('bets', [undefinedStakeBet]);
      fixture.detectChanges();

      const stake = fixture.debugElement.query(By.css('.stake'));
      expect(stake.nativeElement.textContent).toBe('$0');
    });

    it('should handle void status', () => {
      const voidBet: BetHistoryItem = {
        id: 'bet-void',
        bets: [
          {
            id: 'bet-void-1',
            eventId: 'event-1',
            eventTitle: 'Cancelled Match',
            selection: 'home',
            odds: 2.0,
            stake: 50,
          },
        ],
        totalStake: 50,
        totalOdds: 2.0,
        potentialWin: 100,
        status: 'void',
        placedAt: new Date(),
      };

      componentRef.setInput('bets', [voidBet]);
      fixture.detectChanges();

      const statusChip = fixture.debugElement.query(By.css('mat-chip'));
      expect(statusChip.nativeElement.classList.contains('status-void')).toBe(true);
      expect(statusChip.nativeElement.textContent.trim()).toBe('VOID');
    });
  });

  describe('Dynamic Updates', () => {
    it('should update when bets input changes', () => {
      componentRef.setInput('bets', [mockBetHistoryItems[0]]);
      fixture.detectChanges();

      let betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      expect(betCards.length).toBe(1);

      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();

      betCards = fixture.debugElement.queryAll(By.css('.bet-card'));
      expect(betCards.length).toBe(3);
    });

    it('should switch to empty state when bets are cleared', () => {
      componentRef.setInput('bets', mockBetHistoryItems);
      fixture.detectChanges();

      let emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeFalsy();

      componentRef.setInput('bets', []);
      fixture.detectChanges();

      emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });
  });
});
