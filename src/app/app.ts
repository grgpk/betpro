import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { OddsService } from './services/odds.service';
import { BetslipComponent } from './components/betslip/betslip.component';

@Component({
  selector: 'sb-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BetslipComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private oddsService = inject(OddsService);

  ngOnInit(): void {
    // Start real-time odds simulation
    this.oddsService.startOddsSimulation().subscribe();
  }
}
