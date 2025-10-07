import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
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

@Component({
  selector: 'sb-bet-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './bet-history.component.html',
  styleUrl: './bet-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryComponent implements OnInit {
  private store = inject(Store);

  allBets = this.store.selectSignal(selectBetHistory);
  pendingBets = this.store.selectSignal(selectPendingBets);
  settledBets = this.store.selectSignal(selectSettledBets);
  totalWinnings = this.store.selectSignal(selectTotalWinnings);
  totalLosses = this.store.selectSignal(selectTotalLosses);
  netProfit = this.store.selectSignal(selectNetProfit);
  loading = this.store.selectSignal(selectBetHistoryLoading);

  stats = computed(() => ({
    totalBets: this.allBets().length,
    pendingCount: this.pendingBets().length,
    settledCount: this.settledBets().length,
    winnings: this.totalWinnings(),
    losses: this.totalLosses(),
    netProfit: this.netProfit(),
  }));

  ngOnInit(): void {
    this.store.dispatch(BetHistoryActions.loadBetHistory());
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      won: 'status-won',
      lost: 'status-lost',
      void: 'status-void',
    };
    return statusMap[status] || '';
  }

  deleteBet(betId: string): void {
    if (confirm('Are you sure you want to delete this bet from history?')) {
      this.store.dispatch(BetHistoryActions.deleteBetFromHistory({ betId }));
    }
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all bet history?')) {
      this.store.dispatch(BetHistoryActions.clearBetHistory());
    }
  }
}
