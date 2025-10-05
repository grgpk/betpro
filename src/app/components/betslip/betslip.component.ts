import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import {
  selectBetslipBets,
  selectBetslipCount,
  selectBetslipPotentialWin,
  selectBetslipTotalOdds,
  selectBetslipTotalStake,
} from '../../store/betslip/betslip.selectors';
import { BetListComponent } from './bet-list/bet-list.component';
import { BetslipSummaryComponent } from './betslip-summary/betslip-summary.component';

@Component({
  selector: 'sb-betslip',
  imports: [
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    BetListComponent,
    BetslipSummaryComponent,
  ],
  templateUrl: './betslip.component.html',
  styleUrl: './betslip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetslipComponent {
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  bets = this.store.selectSignal(selectBetslipBets);
  betCount = this.store.selectSignal(selectBetslipCount);
  totalOdds = this.store.selectSignal(selectBetslipTotalOdds);
  totalStake = this.store.selectSignal(selectBetslipTotalStake);
  potentialWin = this.store.selectSignal(selectBetslipPotentialWin);

  isPlaceBetDisabled = computed(() => this.totalStake() === 0);

  onStakeUpdated(event: { betId: string; stake: number }): void {
    this.store.dispatch(
      BetslipActions.updateStake({ betId: event.betId, stake: Number(event.stake) }),
    );
  }

  onBetRemoved(betId: string): void {
    this.store.dispatch(BetslipActions.removeFromBetslip({ betId }));
    this.snackBar.open('Removed from betslip', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  }

  onClearBetslip(): void {
    if (confirm('Are you sure you want to clear the betslip?')) {
      this.store.dispatch(BetslipActions.clearBetslip());
      this.snackBar.open('Betslip cleared', 'Close', {
        duration: 2000,
        panelClass: ['info-snackbar'],
      });
    }
  }

  onPlaceBet(): void {
    const hasStakes = this.bets().every((bet) => bet.stake && bet.stake > 0);

    if (!hasStakes) {
      this.snackBar.open('Please enter stake amounts for all bets', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    if (confirm('Place this bet?')) {
      this.store.dispatch(BetslipActions.placeBet());
      this.snackBar.open('Bet placed successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    }
  }
}
