import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BetHistoryItem } from '../models/bet-history.model';

@Injectable({
  providedIn: 'root',
})
export class BetHistoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/betHistory';

  getBetHistory(): Observable<BetHistoryItem[]> {
    return this.http.get<BetHistoryItem[]>(this.apiUrl).pipe(
      map((items) =>
        items.map((item) => ({
          ...item,
          placedAt: new Date(item.placedAt),
          settledAt: item.settledAt ? new Date(item.settledAt) : undefined,
        })),
      ),
    );
  }

  getBetHistoryById(id: string): Observable<BetHistoryItem> {
    return this.http.get<BetHistoryItem>(`${this.apiUrl}/${id}`).pipe(
      map((item) => ({
        ...item,
        placedAt: new Date(item.placedAt),
        settledAt: item.settledAt ? new Date(item.settledAt) : undefined,
      })),
    );
  }

  addBetHistory(bet: BetHistoryItem): Observable<BetHistoryItem> {
    return this.http.post<BetHistoryItem>(this.apiUrl, bet);
  }

  updateBetHistory(id: string, bet: Partial<BetHistoryItem>): Observable<BetHistoryItem> {
    return this.http.patch<BetHistoryItem>(`${this.apiUrl}/${id}`, bet);
  }

  deleteBetHistory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
