import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { SPORTS, STATUSES } from '../../constants/const';
import { SportEvent } from '../../models/sport-event.model';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import * as EventsActions from '../../store/events/events.actions';
import {
  selectEventsError,
  selectEventsLoading,
  selectSelectedEvent,
} from '../../store/events/events.selectors';
import { getEventStatusColor } from '../../utils/event.utils';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventViewComponent } from './event-view/event-view.component';

@Component({
  selector: 'sb-event-details',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    EventViewComponent,
    EventEditComponent,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  event = this.store.selectSignal(selectSelectedEvent);
  loading = this.store.selectSignal(selectEventsLoading);
  error = this.store.selectSignal(selectEventsError);

  isEditMode = false;

  sports = SPORTS;
  statuses = STATUSES;

  getStatusColor = getEventStatusColor;

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    sport: ['', Validators.required],
    homeTeam: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    awayTeam: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    startTime: ['', Validators.required],
    status: ['', Validators.required],
    homeOdds: [0, [Validators.required, Validators.min(1.01), Validators.max(100)]],
    drawOdds: [0, [Validators.min(1.01), Validators.max(100)]],
    awayOdds: [0, [Validators.required, Validators.min(1.01), Validators.max(100)]],
    isLive: [false],
  });

  constructor() {
    effect(() => {
      const event = this.event();
      if (event) {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          sport: event.sport,
          homeTeam: event.homeTeam,
          awayTeam: event.awayTeam,
          startTime: event.startTime,
          status: event.status,
          homeOdds: event.odds.home,
          drawOdds: event.odds.draw || null,
          awayOdds: event.odds.away,
          isLive: event.isLive,
        });
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(EventsActions.loadEvent({ id }));
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      const currentEvent = this.event();
      if (currentEvent) {
        this.eventForm.patchValue({
          title: currentEvent.title,
          description: currentEvent.description,
          sport: currentEvent.sport,
          homeTeam: currentEvent.homeTeam,
          awayTeam: currentEvent.awayTeam,
          startTime: currentEvent.startTime,
          status: currentEvent.status,
          homeOdds: currentEvent.odds.home,
          drawOdds: currentEvent.odds.draw || null,
          awayOdds: currentEvent.odds.away,
          isLive: currentEvent.isLive,
        });
      }
    }
  }

  saveEvent(): void {
    if (this.eventForm.valid && this.event()) {
      const formValue = this.eventForm.value;

      const updatedEvent: SportEvent = {
        ...this.event()!,
        title: formValue.title,
        description: formValue.description,
        sport: formValue.sport,
        homeTeam: formValue.homeTeam,
        awayTeam: formValue.awayTeam,
        startTime: formValue.startTime,
        status: formValue.status,
        odds: {
          home: formValue.homeOdds,
          draw: formValue.drawOdds || undefined,
          away: formValue.awayOdds,
        },
        isLive: formValue.isLive,
      };

      this.store.dispatch(EventsActions.updateEvent({ event: updatedEvent }));
      this.isEditMode = false;
      this.snackBar.open('Event updated successfully', 'Close', {
        duration: 2000,
        panelClass: ['success-snackbar'],
      });
    }
  }

  deleteEvent(): void {
    const currentEvent = this.event();
    if (currentEvent && confirm(`Are you sure you want to delete "${currentEvent.title}"?`)) {
      this.store.dispatch(EventsActions.deleteEvent({ id: currentEvent.id }));
      this.router.navigate(['/events']);
      this.snackBar.open('Event deleted', 'Close', {
        duration: 2000,
        panelClass: ['info-snackbar'],
      });
    }
  }

  addToBetslip(selection: 'home' | 'draw' | 'away'): void {
    const currentEvent = this.event();
    if (!currentEvent) return;

    const odds =
      selection === 'home'
        ? currentEvent.odds.home
        : selection === 'draw'
          ? currentEvent.odds.draw!
          : currentEvent.odds.away;

    this.store.dispatch(
      BetslipActions.addToBetslip({
        bet: {
          id: `${currentEvent.id}-${selection}`,
          eventId: currentEvent.id,
          eventTitle: currentEvent.title,
          selection,
          odds,
        },
      }),
    );

    this.snackBar.open('Added to betslip', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  get hasDraw(): boolean {
    const sport = this.eventForm.get('sport')?.value;
    return sport === 'football' || sport === 'volleyball';
  }
}
