import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardComponent } from './event-card.component';
import { SportEvent } from '../../../models/sport-event.model';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  const mockEvent: SportEvent = {
    id: '1',
    title: 'Test Match',
    description: 'Test Description',
    sport: 'football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: new Date(),
    status: 'upcoming',
    isLive: false,
    odds: {
      home: 1.5,
      draw: 3.0,
      away: 2.5,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', mockEvent);
    fixture.componentRef.setInput('statusColor', 'primary');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Match');
    expect(compiled.textContent).toContain('Team A');
    expect(compiled.textContent).toContain('Team B');
  });

  it('should emit betslipClicked when odds button is clicked', () => {
    let emittedEvent: { event: SportEvent; selection: 'home' | 'draw' | 'away' } | undefined;
    component.betslipClicked.subscribe((event) => (emittedEvent = event));

    component.onAddToBetslip('home');

    expect(emittedEvent).toEqual({
      event: mockEvent,
      selection: 'home',
    });
  });

  it('should emit deleteClicked when delete button is clicked', () => {
    let emittedEvent: SportEvent | undefined;
    component.deleteClicked.subscribe((event) => (emittedEvent = event));

    component.onDelete();

    expect(emittedEvent).toEqual(mockEvent);
  });
});
