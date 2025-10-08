import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EventEditComponent } from './event-edit.component';
import { Sport, EventStatus } from '../../event-list/types';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;
  let componentRef: ComponentRef<EventEditComponent>;

  const mockSports: Sport[] = ['football', 'basketball'];
  const mockStatuses: EventStatus[] = ['upcoming', 'live', 'finished'];
  const mockForm = new FormGroup({
    title: new FormControl('Team A vs Team B'),
    description: new FormControl('Test match'),
    homeTeam: new FormControl('Team A'),
    awayTeam: new FormControl('Team B'),
    sport: new FormControl('football'),
    status: new FormControl('upcoming'),
    startTime: new FormControl(new Date()),
    homeOdds: new FormControl(2.5),
    drawOdds: new FormControl(3.0),
    awayOdds: new FormControl(2.8),
    isLive: new FormControl(false),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventEditComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('eventForm', mockForm);
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    componentRef.setInput('hasDraw', true);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept all required inputs', () => {
    componentRef.setInput('eventForm', mockForm);
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    componentRef.setInput('hasDraw', false);
    fixture.detectChanges();

    expect(component.eventForm()).toBe(mockForm);
    expect(component.sports()).toEqual(mockSports);
    expect(component.statuses()).toEqual(mockStatuses);
    expect(component.hasDraw()).toBe(false);
  });

  it('should handle hasDraw as true', () => {
    componentRef.setInput('eventForm', mockForm);
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    componentRef.setInput('hasDraw', true);
    fixture.detectChanges();

    expect(component.hasDraw()).toBe(true);
  });
});
