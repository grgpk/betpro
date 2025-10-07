import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Bet } from '../../../models/bet.model';
import { SlicePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'sb-bet-list',
  imports: [
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    SlicePipe,
    TitleCasePipe,
  ],
  templateUrl: './bet-list.component.html',
  styleUrl: './bet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetListComponent {
  bets = input.required<Bet[]>();

  stakeUpdated = output<{ betId: string; stake: number }>();
  betRemoved = output<string>();

  stakeControls = new Map<string, FormControl<number>>();

  getStakeControl(betId: string): FormControl<number> {
    if (!this.stakeControls.has(betId)) {
      const bet = this.bets().find((b) => b.id === betId);
      this.stakeControls.set(
        betId,
        new FormControl<number>(bet?.stake || 0, { nonNullable: true }),
      );
    }
    return this.stakeControls.get(betId)!;
  }

  onStakeChange(betId: string, stake: number): void {
    this.stakeUpdated.emit({ betId, stake });
  }

  onRemoveBet(betId: string): void {
    this.stakeControls.delete(betId);
    this.betRemoved.emit(betId);
  }
}
