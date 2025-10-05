import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-event-edit',
  standalone: true,
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
})
export class EventEditComponent {
  eventForm = input.required<FormGroup>();
  sports = input.required<string[]>();
  statuses = input.required<string[]>();
  hasDraw = input.required<boolean>();
}
