import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sb-odd-card',
  imports: [MatButtonModule],
  templateUrl: './odd-card.component.html',
  styleUrl: './odd-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OddCardComponent {
  label = input.required<string>();
  oddValue = input.required<number>();

  addToBetslip = output<void>();

  onAddToBetslip(): void {
    this.addToBetslip.emit();
  }
}
