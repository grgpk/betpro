import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BetslipComponent } from './components/betslip/betslip.component';
import { OddsService } from './services/odds.service';

@Component({
  selector: 'sb-root',
  imports: [RouterOutlet, RouterLink, BetslipComponent],
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
