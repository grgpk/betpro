import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { Sport, EventStatus } from '../../event-list/types';

@Component({
  selector: 'sb-event-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditComponent {
  eventForm = input.required<FormGroup>();
  sports = input.required<readonly Sport[]>();
  statuses = input.required<readonly EventStatus[]>();
  hasDraw = input.required<boolean>();
}
