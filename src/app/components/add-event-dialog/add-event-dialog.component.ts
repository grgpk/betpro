import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SportEvent } from '../../models/sport-event.model';
import { SPORTS, STATUSES } from '../../constants/const';

@Component({
  selector: 'sb-add-event-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventDialogComponent {
  private dialogRef = inject(MatDialogRef<AddEventDialogComponent>);
  private fb = inject(FormBuilder);

  sports = SPORTS;
  statuses = STATUSES;

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    sport: ['football', Validators.required],
    homeTeam: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    awayTeam: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    startTime: [new Date(), Validators.required],
    status: ['upcoming', Validators.required],
    homeOdds: [2.0, [Validators.required, Validators.min(1.01), Validators.max(100)]],
    drawOdds: [3.0, [Validators.min(1.01), Validators.max(100)]],
    awayOdds: [2.5, [Validators.required, Validators.min(1.01), Validators.max(100)]],
    isLive: [false],
  });

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const event: Omit<SportEvent, 'id'> = {
        title: formValue.title,
        description: formValue.description,
        sport: formValue.sport,
        homeTeam: formValue.homeTeam,
        awayTeam: formValue.awayTeam,
        startTime: formValue.startTime,
        status: formValue.status,
        odds: {
          home: formValue.homeOdds,
          draw: formValue.drawOdds || undefined,
          away: formValue.awayOdds,
        },
        isLive: formValue.isLive,
      };

      this.dialogRef.close(event);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get hasDraw(): boolean {
    const sport = this.eventForm.get('sport')?.value;
    return sport === 'football' || sport === 'volleyball';
  }
}
