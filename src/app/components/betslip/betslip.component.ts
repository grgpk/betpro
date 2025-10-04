import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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

@Component({
  selector: 'sb-betslip',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule,
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

  stakeControls = new Map<string, FormControl<number>>();

  updateStake(betId: string, stake: number): void {
    this.store.dispatch(BetslipActions.updateStake({ betId, stake: Number(stake) }));
  }

  removeBet(betId: string): void {
    this.store.dispatch(BetslipActions.removeFromBetslip({ betId }));
    this.stakeControls.delete(betId);
    this.snackBar.open('Removed from betslip', 'Close', { duration: 2000 });
  }

  clearBetslip(): void {
    if (confirm('Are you sure you want to clear the betslip?')) {
      this.store.dispatch(BetslipActions.clearBetslip());
      this.stakeControls.clear();
      this.snackBar.open('Betslip cleared', 'Close', { duration: 2000 });
    }
  }

  placeBet(): void {
    const hasStakes = this.bets().every((bet) => bet.stake && bet.stake > 0);

    if (!hasStakes) {
      this.snackBar.open('Please enter stake amounts for all bets', 'Close', { duration: 3000 });
      return;
    }

    if (confirm('Place this bet?')) {
      this.store.dispatch(BetslipActions.placeBet());
      this.stakeControls.clear();
      this.snackBar.open('Bet placed successfully!', 'Close', { duration: 3000 });
    }
  }

  getStakeControl(betId: string): FormControl<number> {
    if (!this.stakeControls.has(betId)) {
      const bet = this.bets().find((b) => b.id === betId);
      this.stakeControls.set(
        betId,
        new FormControl<number>(bet?.stake || 0, { nonNullable: true })
      );
    }
    return this.stakeControls.get(betId)!;
  }
}
