import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SPORTS, STATUSES } from '../../constants/const';
import { EventFilters } from '../../models/filters.model';
import { SportEvent } from '../../models/sport-event.model';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import * as EventsActions from '../../store/events/events.actions';
import {
  selectAllEvents,
  selectEventsError,
  selectEventsFilters,
  selectEventsLoading,
  selectEventsPagination,
  selectEventsSort,
  selectEventsTotal,
} from '../../store/events/events.selectors';
import { getEventStatusColor } from '../../utils/event.utils';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { EventCardComponent } from './event-card/event-card.component';
import { EventFiltersComponent, FilterValues } from './event-filters/event-filters.component';
import { EventSortingComponent } from './event-sorting/event-sorting.component';
import type { EventStatus, Sport } from './types';

@Component({
  selector: 'sb-event-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ScrollingModule,
    EventFiltersComponent,
    EventSortingComponent,
    EventCardComponent,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  events = this.store.selectSignal(selectAllEvents);
  loading = this.store.selectSignal(selectEventsLoading);
  error = this.store.selectSignal(selectEventsError);
  total = this.store.selectSignal(selectEventsTotal);
  pagination = this.store.selectSignal(selectEventsPagination);
  sort = this.store.selectSignal(selectEventsSort);
  filters = this.store.selectSignal(selectEventsFilters);

  sports = SPORTS;
  statuses = STATUSES;

  // Compute filter values from store for the filter component
  currentFilterValues = computed(() => {
    const storeFilters = this.filters();
    return {
      sport: storeFilters.sport || '',
      status: storeFilters.status || '',
      dateFrom: storeFilters.dateFrom ? new Date(storeFilters.dateFrom) : null,
      dateTo: storeFilters.dateTo ? new Date(storeFilters.dateTo) : null,
    };
  });

  // Virtual scrolling settings
  itemSize = 480; // Approximate height of each event card in pixels

  // Automatically use virtual scroll when page size > 50
  useVirtualScroll = computed(() => this.pagination().pageSize > 50);

  getStatusColor = getEventStatusColor;

  dialogCloseSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.store.dispatch(BetslipActions.loadBetslipFromStorage());

    // Load events once - filters/sort/pagination are loaded from localStorage in reducer
    this.store.dispatch(EventsActions.loadEvents());
  }

  onFiltersChanged(values: FilterValues): void {
    const filters: EventFilters = {};
    if (values.sport) {
      filters.sport = values.sport as Sport;
    }
    if (values.status) {
      filters.status = values.status as EventStatus;
    }
    if (values.dateFrom) filters.dateFrom = values.dateFrom.toISOString();
    if (values.dateTo) filters.dateTo = values.dateTo.toISOString();

    this.store.dispatch(EventsActions.setFilters({ filters }));
  }

  onClearFilters(): void {
    this.store.dispatch(EventsActions.setFilters({ filters: {} }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      EventsActions.setPagination({
        pagination: { page: event.pageIndex + 1, pageSize: event.pageSize },
      }),
    );
  }

  onSortChange(field: 'title' | 'startTime' | 'sport' | 'status'): void {
    const currentSort = this.sort();
    const direction =
      currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';

    this.store.dispatch(
      EventsActions.setSort({
        sort: { field, direction },
      }),
    );
  }

  addToBetslip(event: SportEvent, selection: 'home' | 'draw' | 'away'): void {
    const odds =
      selection === 'home'
        ? event.odds.home
        : selection === 'draw'
          ? event.odds.draw!
          : event.odds.away;

    this.store.dispatch(
      BetslipActions.addToBetslip({
        bet: {
          id: `${event.id}-${selection}`,
          eventId: event.id,
          eventTitle: event.title,
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

  deleteEvent(event: SportEvent): void {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.store.dispatch(EventsActions.deleteEvent({ id: event.id }));
      this.snackBar.open('Event deleted', 'Close', {
        duration: 2000,
        panelClass: ['info-snackbar'],
      });
    }
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '600px',
    });

    this.dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(EventsActions.addEvent({ event: result }));
        this.snackBar.open('Event added successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  trackById(index: number, item: SportEvent): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.dialogCloseSubscription?.unsubscribe();
  }
}
