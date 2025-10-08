import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface BetStats {
  totalBets: number;
  winnings: number;
  losses: number;
  netProfit: number;
}

@Component({
  selector: 'sb-bet-stats-cards',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './bet-stats-cards.component.html',
  styleUrl: './bet-stats-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetStatsCardsComponent {
  stats = input.required<BetStats>();
}
