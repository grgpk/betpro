import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SportEvent } from '../../models/sport-event.model';
import * as EventsActions from '../../store/events/events.actions';
import { selectSelectedEvent } from '../../store/events/events.selectors';
import { EventDetailsComponent } from './event-details.component';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;
  let store: MockStore;

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
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [EventDetailsComponent],
      providers: [
        provideMockStore({
          initialState: {
            events: {
              selectedEvent: null,
              loading: false,
              error: null,
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEvent on init', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(EventsActions.loadEvent({ id: '1' }));
  });

  it('should toggle edit mode', () => {
    expect(component.isEditMode).toBe(false);

    component.toggleEditMode();

    expect(component.isEditMode).toBe(true);

    component.toggleEditMode();

    expect(component.isEditMode).toBe(false);
  });

  it('should not dispatch deleteEvent when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    store.overrideSelector(selectSelectedEvent, mockEvent);
    store.refreshState();
    const dispatchSpy = store.dispatch as jasmine.Spy;
    dispatchSpy.calls.reset();

    component.deleteEvent();

    expect(store.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: EventsActions.deleteEvent.type,
      }),
    );
  });

  it('should return true for hasDraw when sport is football', () => {
    component.eventForm.patchValue({ sport: 'football' });

    expect(component.hasDraw).toBe(true);
  });

  it('should return false for hasDraw when sport is basketball', () => {
    component.eventForm.patchValue({ sport: 'basketball' });

    expect(component.hasDraw).toBe(false);
  });
});
