import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BetHistoryService } from './bet-history.service';
import { BetHistoryItem } from '../../models/bet-history.model';
import { environment } from '../../../environments/environment';

describe('BetHistoryService', () => {
  let service: BetHistoryService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/betHistory`;

  const mockBetHistory: BetHistoryItem[] = [
    {
      id: '1',
      bets: [
        {
          id: 'bet-1',
          eventId: 'event-1',
          eventTitle: 'Test Match',
          selection: 'home',
          odds: 2.5,
          stake: 50,
        },
      ],
      totalStake: 50,
      totalOdds: 2.5,
      potentialWin: 125,
      status: 'won',
      actualWin: 125,
      placedAt: new Date('2025-10-01'),
    },
    {
      id: '2',
      bets: [
        {
          id: 'bet-2',
          eventId: 'event-2',
          eventTitle: 'Another Match',
          selection: 'away',
          odds: 3.0,
          stake: 25,
        },
      ],
      totalStake: 25,
      totalOdds: 3.0,
      potentialWin: 75,
      status: 'pending',
      placedAt: new Date('2025-10-05'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetHistoryService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BetHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBetHistory', () => {
    it('should return empty array when no data', () => {
      service.getBetHistory().subscribe((history) => {
        expect(history).toEqual([]);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('should handle error', () => {
      service.getBetHistory().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('addBetHistory', () => {
    it('should add new bet to history', () => {
      const newBet: BetHistoryItem = {
        id: '3',
        bets: [],
        totalStake: 100,
        totalOdds: 5.0,
        potentialWin: 500,
        status: 'pending',
        placedAt: new Date(),
      };

      service.addBetHistory(newBet).subscribe((bet) => {
        expect(bet).toEqual(newBet);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBet);
      req.flush(newBet);
    });

    it('should handle server-generated ID', () => {
      const newBet: BetHistoryItem = {
        id: 'temp-id',
        bets: [],
        totalStake: 50,
        totalOdds: 2.0,
        potentialWin: 100,
        status: 'pending',
        placedAt: new Date(),
      };

      const serverResponse = { ...newBet, id: 'server-generated-id' };

      service.addBetHistory(newBet).subscribe((bet) => {
        expect(bet.id).toBe('server-generated-id');
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(serverResponse);
    });
  });

  describe('deleteBetHistory', () => {
    it('should delete bet by ID', () => {
      const betId = '123';

      service.deleteBetHistory(betId).subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle 404 error', () => {
      const betId = 'non-existent';

      service.deleteBetHistory(betId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateBetHistory', () => {
    it('should update bet', () => {
      const betId = '123';
      const updates: Partial<BetHistoryItem> = {
        status: 'won',
        actualWin: 250,
      };

      const updatedBet: BetHistoryItem = {
        ...mockBetHistory[0],
        status: 'won',
        actualWin: 250,
      };

      service.updateBetHistory(betId, updates).subscribe((bet) => {
        expect(bet.status).toBe('won');
        expect(bet.actualWin).toBe(250);
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updates);
      req.flush(updatedBet);
    });

    it('should handle partial updates', () => {
      const betId = '123';
      const updates: Partial<BetHistoryItem> = {
        status: 'lost',
      };

      const updatedBet: BetHistoryItem = {
        ...mockBetHistory[0],
        status: 'lost',
      };

      service.updateBetHistory(betId, updates).subscribe((bet) => {
        expect(bet.status).toBe('lost');
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      expect(req.request.body).toEqual(updates);
      req.flush(updatedBet);
    });
  });

  describe('getBetHistoryById', () => {
    it('should convert date strings to Date objects', () => {
      const betId = '1';
      const betWithStringDates = {
        ...mockBetHistory[0],
        placedAt: '2025-10-01T10:00:00Z' as unknown as Date,
        settledAt: '2025-10-01T18:00:00Z' as unknown as Date,
      };

      service.getBetHistoryById(betId).subscribe((bet) => {
        expect(bet.placedAt).toBeInstanceOf(Date);
        expect(bet.settledAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      req.flush(betWithStringDates);
    });

    it('should handle missing settledAt date', () => {
      const betId = '2';
      const betWithoutSettledAt = {
        ...mockBetHistory[1],
        settledAt: null as unknown as Date | undefined,
      };

      service.getBetHistoryById(betId).subscribe((bet) => {
        expect(bet.placedAt).toBeInstanceOf(Date);
        expect(bet.settledAt).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${betId}`);
      req.flush(betWithoutSettledAt);
    });
  });
});
