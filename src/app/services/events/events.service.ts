import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SportEvent } from '../../models/sport-event.model';
import { environment } from '../../../environments/environment';
import { SPORTS, STATUSES } from '../../constants/const';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  getEvents(): Observable<SportEvent[]> {
    return this.http.get<SportEvent[]>(this.apiUrl).pipe(
      map((events) =>
        events.map((e) => ({
          ...e,
          startTime: new Date(e.startTime),
        })),
      ),
    );
  }

  getEvent(id: string): Observable<SportEvent> {
    return this.http.get<SportEvent>(`${this.apiUrl}/${id}`).pipe(
      map((event) => ({
        ...event,
        startTime: new Date(event.startTime),
      })),
    );
  }

  createEvent(event: Omit<SportEvent, 'id'>): Observable<SportEvent> {
    this.validateEvent(event);

    return this.http.post<SportEvent>(this.apiUrl, event).pipe(
      map((createdEvent) => ({
        ...createdEvent,
        startTime: new Date(createdEvent.startTime),
      })),
    );
  }

  updateEvent(event: SportEvent): Observable<SportEvent> {
    this.validateEvent(event);

    return this.http.put<SportEvent>(`${this.apiUrl}/${event.id}`, event).pipe(
      map((updatedEvent) => ({
        ...updatedEvent,
        startTime: new Date(updatedEvent.startTime),
      })),
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private validateEvent(event: SportEvent | Omit<SportEvent, 'id'>): void {
    const errors: string[] = [];

    // Title validation
    if (!event.title || event.title.length < 2 || event.title.length > 100) {
      errors.push('Title must be between 2 and 100 characters');
    }

    // Description validation
    if (!event.description || event.description.length < 2 || event.description.length > 200) {
      errors.push('Description must be between 2 and 200 characters');
    }

    // Sport validation
    if (!SPORTS.includes(event.sport)) {
      errors.push('Invalid sport type');
    }

    // Home team validation
    if (!event.homeTeam || event.homeTeam.length < 2 || event.homeTeam.length > 50) {
      errors.push('Home team must be between 2 and 50 characters');
    }

    // Away team validation
    if (!event.awayTeam || event.awayTeam.length < 2 || event.awayTeam.length > 50) {
      errors.push('Away team must be between 2 and 50 characters');
    }

    // Start time validation
    if (!event.startTime) {
      errors.push('Start time is required');
    }

    // Status validation
    if (!STATUSES.includes(event.status)) {
      errors.push('Invalid status');
    }

    // Odds validation
    if (!event.odds || !event.odds.home || !event.odds.away) {
      errors.push('Home and away odds are required');
    }

    if (event.odds.home < 1.01 || event.odds.home > 100) {
      errors.push('Home odds must be between 1.01 and 100');
    }

    if (event.odds.away < 1.01 || event.odds.away > 100) {
      errors.push('Away odds must be between 1.01 and 100');
    }

    if (event.odds.draw && (event.odds.draw < 1.01 || event.odds.draw > 100)) {
      errors.push('Draw odds must be between 1.01 and 100');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }
}
