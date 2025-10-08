import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BetHistoryItem } from '../../../models/bet-history.model';
import { BetHistoryListComponent } from '../bet-history-list/bet-history-list.component';

@Component({
  selector: 'sb-bet-history-tabs',
  imports: [MatTabsModule, BetHistoryListComponent],
  templateUrl: './bet-history-tabs.component.html',
  styleUrl: './bet-history-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryTabsComponent {
  allBets = input.required<BetHistoryItem[]>();
  pendingBets = input.required<BetHistoryItem[]>();
  settledBets = input.required<BetHistoryItem[]>();

  deleteBet = output<string>();

  onDeleteBet(betId: string): void {
    this.deleteBet.emit(betId);
  }
}
