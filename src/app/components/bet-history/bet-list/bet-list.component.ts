import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BetHistoryItem } from '../../../models/bet-history.model';

@Component({
  selector: 'sb-bet-list',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    TitleCasePipe,
    UpperCasePipe,
  ],
  templateUrl: './bet-list.component.html',
  styleUrl: './bet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetListComponent {
  bets = input.required<BetHistoryItem[]>();
  emptyIcon = input<string>('history');
  emptyMessage = input<string>('No bets in history yet');

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
