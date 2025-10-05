import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { SportEvent } from '../../../models/sport-event.model';

@Component({
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.scss',
})
export class EventViewComponent {
  event = input.required<SportEvent>();
  addToBetslip = output<'home' | 'draw' | 'away'>();

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'live':
        return 'warn';
      case 'finished':
        return 'accent';
      default:
        return 'primary';
    }
  }

  onAddToBetslip(selection: 'home' | 'draw' | 'away') {
    this.addToBetslip.emit(selection);
  }
}
