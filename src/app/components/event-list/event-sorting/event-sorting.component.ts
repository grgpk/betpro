import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EventSort } from '../../../models/filters.model';

@Component({
  selector: 'sb-event-sorting',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './event-sorting.component.html',
  styleUrl: './event-sorting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSortingComponent {
  currentSort = input.required<EventSort>();

  sortChanged = output<'title' | 'startTime' | 'sport' | 'status'>();

  onSortClick(field: 'title' | 'startTime' | 'sport' | 'status'): void {
    this.sortChanged.emit(field);
  }
}
