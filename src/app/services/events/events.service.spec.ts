import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { SportEvent } from '../../models/sport-event.model';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch events', () => {
    const mockEvents: SportEvent[] = [
      {
        id: '1',
        title: 'Test Event',
        description: 'Test Description',
        sport: 'football',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        startTime: new Date(),
        status: 'upcoming',
        odds: { home: 2.0, draw: 3.0, away: 2.5 },
        isLive: false,
      },
    ];

    service.getEvents().subscribe((result) => {
      expect(result.events.length).toBe(1);
      expect(result.events[0].title).toBe('Test Event');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/events`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockEvents, total: 1 });
  });

  it('should create an event', () => {
    const newEvent: Omit<SportEvent, 'id'> = {
      title: 'New Event',
      description: 'New Description',
      sport: 'basketball',
      homeTeam: 'Team C',
      awayTeam: 'Team D',
      startTime: new Date(),
      status: 'upcoming',
      odds: { home: 1.8, away: 2.2 },
      isLive: false,
    };

    service.createEvent(newEvent).subscribe((event) => {
      expect(event.id).toBe('2');
      expect(event.title).toBe('New Event');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/events`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newEvent, id: '2' });
  });

  it('should throw error for invalid event data', () => {
    const invalidEvent: Omit<SportEvent, 'id'> = {
      title: 'A',
      description: 'Valid description',
      sport: 'football',
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      startTime: new Date(),
      status: 'upcoming',
      odds: { home: 2.0, away: 2.5 },
      isLive: false,
    };

    expect(() => {
      (service as any).validateEvent(invalidEvent);
    }).toThrow();
  });
});
