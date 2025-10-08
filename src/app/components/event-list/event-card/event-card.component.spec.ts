import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EventCardComponent } from './event-card.component';
import { SportEvent } from '../../../models/sport-event.model';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;
  let componentRef: ComponentRef<EventCardComponent>;

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
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept event and statusColor inputs', () => {
    componentRef.setInput('event', mockEvent);
    componentRef.setInput('statusColor', 'primary');
    fixture.detectChanges();

    expect(component.event()).toEqual(mockEvent);
    expect(component.statusColor()).toBe('primary');
  });

  it('should emit betslipClicked when onAddToBetslip is called', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    const betslipClickedSpy = jasmine.createSpy('betslipClicked');
    component.betslipClicked.subscribe(betslipClickedSpy);

    component.onAddToBetslip('home');

    expect(betslipClickedSpy).toHaveBeenCalledWith({
      event: mockEvent,
      selection: 'home',
    });
  });

  it('should emit deleteClicked when onDelete is called', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    const deleteClickedSpy = jasmine.createSpy('deleteClicked');
    component.deleteClicked.subscribe(deleteClickedSpy);

    component.onDelete();

    expect(deleteClickedSpy).toHaveBeenCalledWith(mockEvent);
  });
});
