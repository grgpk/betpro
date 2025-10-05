import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';

export interface FilterValues {
  sport: string;
  status: string;
  search: string;
}

@Component({
  selector: 'sb-event-filters',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TitleCasePipe,
  ],
  templateUrl: './event-filters.component.html',
  styleUrl: './event-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFiltersComponent {
  sports = input.required<string[]>();
  statuses = input.required<string[]>();
  initialValues = input<FilterValues>({ sport: '', status: '', search: '' });

  filtersChanged = output<FilterValues>();
  clearFiltersClicked = output<void>();

  filterForm = new FormGroup({
    sport: new FormControl<string>(''),
    status: new FormControl<string>(''),
    search: new FormControl<string>(''),
  });

  constructor() {
    // Set initial values when they change
    effect(() => {
      const values = this.initialValues();
      this.filterForm.patchValue(values, { emitEvent: false });
    });

    // Emit changes with debounce
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
      this.filtersChanged.emit({
        sport: values.sport || '',
        status: values.status || '',
        search: values.search || '',
      });
    });
  }

  onClearFilters(): void {
    this.filterForm.reset();
    this.clearFiltersClicked.emit();
  }
}
