import { Component, inject, OnInit, signal } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { BetslipComponent } from './components/betslip/betslip.component';
import { OddsService } from './services/odds.service';
import * as BetHistoryActions from './store/bet-history/bet-history.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sb-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatProgressBarModule,
    BetslipComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private oddsService = inject(OddsService);
  private store = inject(Store);
  private router = inject(Router);

  navigating = signal(false);

  ngOnInit(): void {
    this.oddsService.startOddsSimulation().subscribe();
    this.store.dispatch(BetHistoryActions.loadBetHistory());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event) => {
        this.navigating.set(event instanceof NavigationStart);
      });
  }
}
