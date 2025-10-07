import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Subscription } from 'rxjs';
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
export class EventFiltersComponent implements OnDestroy {
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

  private subscription = new Subscription();

  filterForm = new FormGroup({
    sport: new FormControl<string>(''),
    status: new FormControl<string>(''),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  constructor() {
    effect(() => {
      const values = this.initialValues();
      this.filterForm.patchValue(values, { emitEvent: false });
    });

    this.subscription.add(
      this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
        this.filtersChanged.emit({
          sport: values.sport || '',
          status: values.status || '',
          dateFrom: values.dateFrom,
          dateTo: values.dateTo,
        });
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClearFilters(): void {
    this.filterForm.reset();
    this.clearFiltersClicked.emit();
  }
}
