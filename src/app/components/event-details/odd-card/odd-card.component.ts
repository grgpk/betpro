import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'sb-odd-card',
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './odd-card.component.html',
  styleUrl: './odd-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OddCardComponent {
  label = input.required<string>();
  oddValue = input.required<number>();
  isFinished = input.required<boolean>();

  addToBetslip = output<void>();

  onAddToBetslip(): void {
    this.addToBetslip.emit();
  }
}
