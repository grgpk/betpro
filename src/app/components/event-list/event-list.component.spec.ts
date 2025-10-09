import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as EventsActions from '../../store/events/events.actions';
import * as BetslipActions from '../../store/betslip/betslip.actions';
import { SportEvent } from '../../models/sport-event.model';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let store: MockStore;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockEvent: SportEvent = {
    id: '1',
    title: 'Team A vs Team B',
    description: 'Test match',
    sport: 'football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: new Date('2025-10-15'),
    status: 'upcoming',
    odds: {
      home: 2.5,
      draw: 3.0,
      away: 2.8,
    },
    isLive: false,
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    snackBarSpy.open.and.returnValue({} as MatSnackBarRef<unknown>);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        provideMockStore({
          initialState: {
            events: {
              allEvents: [],
              loading: false,
              error: null,
              pagination: { page: 1, pageSize: 10 },
              sort: { field: 'startTime', direction: 'asc' },
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEvents and loadBetslipFromStorage on init', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(BetslipActions.loadBetslipFromStorage());
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: EventsActions.loadEvents.type,
      }),
    );
  });

  it('should dispatch setFilters when onFiltersChanged is called', () => {
    component.onFiltersChanged({
      sport: 'football',
      status: 'upcoming',
      dateFrom: null,
      dateTo: null,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      EventsActions.setFilters({
        filters: { sport: 'football', status: 'upcoming' },
      }),
    );
  });

  it('should dispatch setPagination when onPageChange is called', () => {
    const pageEvent = {
      pageIndex: 1,
      pageSize: 25,
      length: 100,
    };

    component.onPageChange(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      EventsActions.setPagination({
        pagination: { page: 2, pageSize: 25 },
      }),
    );
  });

  it('should dispatch setSort when onSortChange is called', () => {
    component.onSortChange('title');

    expect(store.dispatch).toHaveBeenCalledWith(
      EventsActions.setSort({
        sort: { field: 'title', direction: 'asc' },
      }),
    );
  });

  it('should not dispatch deleteEvent when deletion is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const dispatchSpy = store.dispatch as jasmine.Spy;
    dispatchSpy.calls.reset();

    component.deleteEvent(mockEvent);

    expect(store.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: EventsActions.deleteEvent.type,
      }),
    );
  });

  it('should unsubscribe on destroy', () => {
    component.dialogCloseSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

    component.ngOnDestroy();

    expect(component.dialogCloseSubscription?.unsubscribe).toHaveBeenCalled();
  });
});
