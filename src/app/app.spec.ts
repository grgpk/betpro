import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { OddsService } from './services/odds.service';
import { of } from 'rxjs';
import * as BetHistoryActions from './store/bet-history/bet-history.actions';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let oddsService: jasmine.SpyObj<OddsService>;
  let store: MockStore;

  beforeEach(async () => {
    const oddsServiceSpy = jasmine.createSpyObj('OddsService', ['startOddsSimulation']);
    oddsServiceSpy.startOddsSimulation.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideMockStore(),
        provideRouter([]),
        { provide: OddsService, useValue: oddsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    oddsService = TestBed.inject(OddsService) as jasmine.SpyObj<OddsService>;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start odds simulation on init', () => {
    fixture.detectChanges();

    expect(oddsService.startOddsSimulation).toHaveBeenCalled();
  });

  it('should dispatch loadBetHistory on init', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(BetHistoryActions.loadBetHistory());
  });

  it('should initialize navigating signal as false', () => {
    expect(component.navigating()).toBe(false);
  });
});
