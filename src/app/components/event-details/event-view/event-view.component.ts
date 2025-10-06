import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SportEvent } from '../../../models/sport-event.model';
import { getEventStatusColor } from '../../../utils/event.utils';
import { OddCardComponent } from '../odd-card/odd-card.component';

@Component({
  selector: 'sb-event-view',
  imports: [CommonModule, MatCardModule, MatChipsModule, OddCardComponent],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventViewComponent {
  event = input.required<SportEvent>();
  addToBetslip = output<'home' | 'draw' | 'away'>();

  getStatusColor = getEventStatusColor;

  onAddToBetslip(selection: 'home' | 'draw' | 'away') {
    this.addToBetslip.emit(selection);
  }
}
