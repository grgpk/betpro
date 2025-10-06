import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { EventFilters } from '../../models/filters.model';
import { SportEvent } from '../../models/sport-event.model';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import * as EventsActions from '../../store/events/events.actions';
import {
  selectAllEvents,
  selectEventsError,
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
import { SPORTS, STATUSES } from '../../constants/const';
import { Subscription } from 'rxjs';

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

  events = this.store.selectSignal(selectAllEvents);
  loading = this.store.selectSignal(selectEventsLoading);
  error = this.store.selectSignal(selectEventsError);
  total = this.store.selectSignal(selectEventsTotal);
  pagination = this.store.selectSignal(selectEventsPagination);
  sort = this.store.selectSignal(selectEventsSort);

  sports = SPORTS;
  statuses = STATUSES;

  currentFilterValues: FilterValues = {
    sport: '',
    status: '',
    search: '',
    dateFrom: null,
    dateTo: null,
  };

  // Virtual scrolling settings
  itemSize = 480; // Approximate height of each event card in pixels
  useVirtualScroll = false; // Toggle between virtual scroll and pagination

  getStatusColor = getEventStatusColor;

  dialogCloseSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.store.dispatch(BetslipActions.loadBetslipFromStorage());

    this.loadFiltersFromUrl();

    this.loadEvents();
  }

  onFiltersChanged(values: FilterValues): void {
    this.currentFilterValues = values;
    const filters: EventFilters = {};
    if (values.sport) filters.sport = values.sport as any;
    if (values.status) filters.status = values.status as any;
    if (values.search) filters.search = values.search;
    if (values.dateFrom) filters.dateFrom = values.dateFrom.toISOString();
    if (values.dateTo) filters.dateTo = values.dateTo.toISOString();

    this.store.dispatch(EventsActions.setFilters({ filters }));
    this.saveFiltersToUrl();
    this.loadEvents();
  }

  onClearFilters(): void {
    this.currentFilterValues = { sport: '', status: '', search: '', dateFrom: null, dateTo: null };
    this.store.dispatch(EventsActions.setFilters({ filters: {} }));
    this.saveFiltersToUrl();
    this.loadEvents();
  }

  loadEvents(): void {
    const filters = this.getFiltersFromValues();
    const sortValue = this.sort();
    let paginationValue = this.pagination();

    if (this.useVirtualScroll) {
      paginationValue = { page: 1, pageSize: 1000 };
      this.store.dispatch(EventsActions.setPagination({ pagination: paginationValue }));
    }

    this.store.dispatch(
      EventsActions.loadEvents({
        filters,
        sort: sortValue,
        pagination: paginationValue,
      }),
    );
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      EventsActions.setPagination({
        pagination: { page: event.pageIndex + 1, pageSize: event.pageSize },
      }),
    );
    this.saveFiltersToUrl();
    this.loadEvents();
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
    this.saveFiltersToUrl();
    this.loadEvents();
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

  private getFiltersFromValues(): EventFilters {
    const filters: EventFilters = {};

    if (this.currentFilterValues.sport) filters.sport = this.currentFilterValues.sport as any;
    if (this.currentFilterValues.status) filters.status = this.currentFilterValues.status as any;
    if (this.currentFilterValues.search) filters.search = this.currentFilterValues.search;
    if (this.currentFilterValues.dateFrom)
      filters.dateFrom = this.currentFilterValues.dateFrom.toISOString();
    if (this.currentFilterValues.dateTo)
      filters.dateTo = this.currentFilterValues.dateTo.toISOString();

    return filters;
  }

  private loadFiltersFromUrl(): void {
    const params = new URLSearchParams(window.location.search);

    const sport = params.get('sport') || '';
    const status = params.get('status') || '';
    const search = params.get('search') || '';
    const dateFrom = params.get('dateFrom') ? new Date(params.get('dateFrom')!) : null;
    const dateTo = params.get('dateTo') ? new Date(params.get('dateTo')!) : null;
    const page = params.get('page');
    const pageSize = params.get('pageSize');
    const sortField = params.get('sortField');
    const sortDirection = params.get('sortDirection');

    this.currentFilterValues = { sport, status, search, dateFrom, dateTo };

    if (page && pageSize) {
      this.store.dispatch(
        EventsActions.setPagination({
          pagination: { page: parseInt(page), pageSize: parseInt(pageSize) },
        }),
      );
    }

    if (sortField && sortDirection) {
      this.store.dispatch(
        EventsActions.setSort({
          sort: { field: sortField as any, direction: sortDirection as any },
        }),
      );
    }
  }

  private saveFiltersToUrl(): void {
    const filters = this.getFiltersFromValues();
    const paginationValue = this.pagination();
    const sortValue = this.sort();

    const params = new URLSearchParams();

    if (filters.sport) params.set('sport', filters.sport);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    params.set('page', paginationValue.page.toString());
    params.set('pageSize', paginationValue.pageSize.toString());
    params.set('sortField', sortValue.field);
    params.set('sortDirection', sortValue.direction);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  trackById(index: number, item: SportEvent): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.dialogCloseSubscription?.unsubscribe();
  }
}
