import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';
import * as EventsActions from '../../store/events/events.actions';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import {
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
  selectEventsFilters,
  selectEventsSort,
  selectEventsPagination,
  selectEventsTotal,
} from '../../store/events/events.selectors';
import { SportEvent } from '../../models/sport-event.model';
import { EventFilters } from '../../models/filters.model';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'sb-event-list',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  events = this.store.selectSignal(selectAllEvents);
  loading = this.store.selectSignal(selectEventsLoading);
  error = this.store.selectSignal(selectEventsError);
  total = this.store.selectSignal(selectEventsTotal);
  pagination = this.store.selectSignal(selectEventsPagination);
  sort = this.store.selectSignal(selectEventsSort);

  filterForm = new FormGroup({
    sport: new FormControl<string>(''),
    status: new FormControl<string>(''),
    search: new FormControl<string>(''),
  });

  sports = ['football', 'basketball', 'tennis', 'volleyball'];
  statuses = ['upcoming', 'live', 'finished'];

  constructor() {
    // Load betslip from storage on init
    this.store.dispatch(BetslipActions.loadBetslipFromStorage());

    // Load filters from URL params
    this.loadFiltersFromUrl();

    // Watch for filter changes
    effect(() => {
      this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
        const filters: EventFilters = {};
        if (values.sport) filters.sport = values.sport as any;
        if (values.status) filters.status = values.status as any;
        if (values.search) filters.search = values.search;

        this.store.dispatch(EventsActions.setFilters({ filters }));
        this.saveFiltersToUrl();
        this.loadEvents();
      });
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const filters = this.getFiltersFromForm();
    const sortValue = this.sort();
    const paginationValue = this.pagination();

    this.store.dispatch(
      EventsActions.loadEvents({
        filters,
        sort: sortValue,
        pagination: paginationValue,
      })
    );
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      EventsActions.setPagination({
        pagination: { page: event.pageIndex + 1, pageSize: event.pageSize },
      })
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
      })
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
      })
    );

    this.snackBar.open('Added to betslip', 'Close', { duration: 2000 });
  }

  deleteEvent(event: SportEvent): void {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.store.dispatch(EventsActions.deleteEvent({ id: event.id }));
      this.snackBar.open('Event deleted', 'Close', { duration: 2000 });
    }
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(EventsActions.addEvent({ event: result }));
        this.snackBar.open('Event added successfully', 'Close', { duration: 2000 });
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.store.dispatch(EventsActions.setFilters({ filters: {} }));
    this.saveFiltersToUrl();
    this.loadEvents();
  }

  private getFiltersFromForm(): EventFilters {
    const values = this.filterForm.value;
    const filters: EventFilters = {};

    if (values.sport) filters.sport = values.sport as any;
    if (values.status) filters.status = values.status as any;
    if (values.search) filters.search = values.search;

    return filters;
  }

  private loadFiltersFromUrl(): void {
    const params = new URLSearchParams(window.location.search);

    const sport = params.get('sport');
    const status = params.get('status');
    const search = params.get('search');
    const page = params.get('page');
    const pageSize = params.get('pageSize');
    const sortField = params.get('sortField');
    const sortDirection = params.get('sortDirection');

    if (sport) this.filterForm.patchValue({ sport });
    if (status) this.filterForm.patchValue({ status });
    if (search) this.filterForm.patchValue({ search });

    if (page && pageSize) {
      this.store.dispatch(
        EventsActions.setPagination({
          pagination: { page: parseInt(page), pageSize: parseInt(pageSize) },
        })
      );
    }

    if (sortField && sortDirection) {
      this.store.dispatch(
        EventsActions.setSort({
          sort: { field: sortField as any, direction: sortDirection as any },
        })
      );
    }
  }

  private saveFiltersToUrl(): void {
    const filters = this.getFiltersFromForm();
    const paginationValue = this.pagination();
    const sortValue = this.sort();

    const params = new URLSearchParams();

    if (filters.sport) params.set('sport', filters.sport);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    params.set('page', paginationValue.page.toString());
    params.set('pageSize', paginationValue.pageSize.toString());
    params.set('sortField', sortValue.field);
    params.set('sortDirection', sortValue.direction);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'live':
        return 'warn';
      case 'upcoming':
        return 'primary';
      case 'finished':
        return 'accent';
      default:
        return '';
    }
  }
}
