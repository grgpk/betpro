import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sb-betslip-summary',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './betslip-summary.component.html',
  styleUrl: './betslip-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetslipSummaryComponent {
  totalStake = input.required<number>();
  totalOdds = input.required<number>();
  potentialWin = input.required<number>();
  isPlaceBetDisabled = input.required<boolean>();

  placeBet = output<void>();
  clearBetslip = output<void>();

  onPlaceBet(): void {
    this.placeBet.emit();
  }

  onClearBetslip(): void {
    this.clearBetslip.emit();
  }
}
