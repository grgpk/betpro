import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { EventViewComponent } from './event-view.component';
import { SportEvent } from '../../../models/sport-event.model';

describe('EventViewComponent', () => {
  let component: EventViewComponent;
  let fixture: ComponentFixture<EventViewComponent>;
  let componentRef: ComponentRef<EventViewComponent>;

  const mockEvent: SportEvent = {
    id: '1',
    title: 'Team A vs Team B',
    description: 'Football match',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    sport: 'football',
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
      imports: [EventViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventViewComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept event input', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    expect(component.event()).toEqual(mockEvent);
  });

  it('should emit addToBetslip when onAddToBetslip is called with home', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    const addToBetslipSpy = jasmine.createSpy('addToBetslip');
    component.addToBetslip.subscribe(addToBetslipSpy);

    component.onAddToBetslip('home');

    expect(addToBetslipSpy).toHaveBeenCalledWith('home');
  });

  it('should emit addToBetslip when onAddToBetslip is called with draw', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    const addToBetslipSpy = jasmine.createSpy('addToBetslip');
    component.addToBetslip.subscribe(addToBetslipSpy);

    component.onAddToBetslip('draw');

    expect(addToBetslipSpy).toHaveBeenCalledWith('draw');
  });

  it('should emit addToBetslip when onAddToBetslip is called with away', () => {
    componentRef.setInput('event', mockEvent);
    fixture.detectChanges();

    const addToBetslipSpy = jasmine.createSpy('addToBetslip');
    component.addToBetslip.subscribe(addToBetslipSpy);

    component.onAddToBetslip('away');

    expect(addToBetslipSpy).toHaveBeenCalledWith('away');
  });
});
