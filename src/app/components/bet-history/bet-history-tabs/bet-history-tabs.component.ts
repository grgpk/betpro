import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BetHistoryItem } from '../../../models/bet-history.model';

@Component({
  selector: 'sb-bet-history-tabs',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './bet-history-tabs.component.html',
  styleUrl: './bet-history-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryTabsComponent {
  allBets = input.required<BetHistoryItem[]>();
  pendingBets = input.required<BetHistoryItem[]>();
  settledBets = input.required<BetHistoryItem[]>();

  deleteBet = output<string>();

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      won: 'status-won',
      lost: 'status-lost',
      void: 'status-void',
    };
    return statusMap[status] || '';
  }

  onDeleteBet(betId: string): void {
    this.deleteBet.emit(betId);
  }
}
