import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BetslipComponent } from './components/betslip/betslip.component';
import { OddsService } from './services/odds.service';
import * as BetHistoryActions from './store/bet-history/bet-history.actions';

@Component({
  selector: 'sb-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, BetslipComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private oddsService = inject(OddsService);
  private store = inject(Store);

  ngOnInit(): void {
    this.oddsService.startOddsSimulation().subscribe();
    this.store.dispatch(BetHistoryActions.loadBetHistory());
  }
}
