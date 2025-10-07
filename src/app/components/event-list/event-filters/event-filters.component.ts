import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TitleCasePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import type { Sport, EventStatus } from '../types';

export interface FilterValues {
  sport: string;
  status: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
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
    MatDatepickerModule,
    MatNativeDateModule,
    TitleCasePipe,
  ],
  templateUrl: './event-filters.component.html',
  styleUrl: './event-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFiltersComponent {
  sports = input.required<readonly Sport[]>();
  statuses = input.required<readonly EventStatus[]>();
  initialValues = input<FilterValues>({
    sport: '',
    status: '',
    dateFrom: null,
    dateTo: null,
  });

  filtersChanged = output<FilterValues>();
  clearFiltersClicked = output<void>();

  filterForm = new FormGroup({
    sport: new FormControl<string>(''),
    status: new FormControl<string>(''),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  valueChanges = toSignal(this.filterForm.valueChanges.pipe(debounceTime(300)), {
    initialValue: this.initialValues(),
  });

  constructor() {
    // Set initial values when they change
    effect(() => {
      const values = this.initialValues();
      this.filterForm.patchValue(values, { emitEvent: false });
    });

    effect(() => {
      const values = this.valueChanges();
      this.filtersChanged.emit({
        sport: values.sport || '',
        status: values.status || '',
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
      });
    });
  }

  onClearFilters(): void {
    this.filterForm.reset();
    this.clearFiltersClicked.emit();
  }
}
