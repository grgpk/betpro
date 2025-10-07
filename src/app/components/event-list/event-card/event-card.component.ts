import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SportEvent } from '../../../models/sport-event.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'sb-event-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
    DatePipe,
    TitleCasePipe,
    MatTooltipModule,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  event = input.required<SportEvent>();
  statusColor = input<string>('');

  betslipClicked = output<{ event: SportEvent; selection: 'home' | 'draw' | 'away' }>();
  deleteClicked = output<SportEvent>();

  onAddToBetslip(selection: 'home' | 'draw' | 'away'): void {
    this.betslipClicked.emit({ event: this.event(), selection });
  }

  onDelete(): void {
    this.deleteClicked.emit(this.event());
  }
}
