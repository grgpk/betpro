import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddEventDialogComponent } from './add-event-dialog.component';

describe('AddEventDialogComponent', () => {
  let component: AddEventDialogComponent;
  let fixture: ComponentFixture<AddEventDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddEventDialogComponent>>;

  beforeEach(async () => {
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AddEventDialogComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogRefMock }],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddEventDialogComponent>
    >;
    fixture = TestBed.createComponent(AddEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.eventForm.get('title')?.value).toBe('');
      expect(component.eventForm.get('description')?.value).toBe('');
      expect(component.eventForm.get('sport')?.value).toBe('football');
      expect(component.eventForm.get('homeTeam')?.value).toBe('');
      expect(component.eventForm.get('awayTeam')?.value).toBe('');
      expect(component.eventForm.get('startTime')?.value).toBeInstanceOf(Date);
      expect(component.eventForm.get('status')?.value).toBe('upcoming');
      expect(component.eventForm.get('homeOdds')?.value).toBe(2.0);
      expect(component.eventForm.get('drawOdds')?.value).toBe(3.0);
      expect(component.eventForm.get('awayOdds')?.value).toBe(2.5);
      expect(component.eventForm.get('isLive')?.value).toBe(false);
    });

    it('should have all form controls', () => {
      expect(component.eventForm.get('title')).toBeTruthy();
      expect(component.eventForm.get('description')).toBeTruthy();
      expect(component.eventForm.get('sport')).toBeTruthy();
      expect(component.eventForm.get('homeTeam')).toBeTruthy();
      expect(component.eventForm.get('awayTeam')).toBeTruthy();
      expect(component.eventForm.get('startTime')).toBeTruthy();
      expect(component.eventForm.get('status')).toBeTruthy();
      expect(component.eventForm.get('homeOdds')).toBeTruthy();
      expect(component.eventForm.get('drawOdds')).toBeTruthy();
      expect(component.eventForm.get('awayOdds')).toBeTruthy();
      expect(component.eventForm.get('isLive')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    describe('Title field', () => {
      it('should be invalid when empty', () => {
        const title = component.eventForm.get('title');
        title?.setValue('');
        expect(title?.hasError('required')).toBe(true);
        expect(title?.valid).toBe(false);
      });

      it('should be invalid when too short', () => {
        const title = component.eventForm.get('title');
        title?.setValue('a');
        expect(title?.hasError('minlength')).toBe(true);
        expect(title?.valid).toBe(false);
      });

      it('should be invalid when too long', () => {
        const title = component.eventForm.get('title');
        title?.setValue('a'.repeat(101));
        expect(title?.hasError('maxlength')).toBe(true);
        expect(title?.valid).toBe(false);
      });

      it('should be valid with correct length', () => {
        const title = component.eventForm.get('title');
        title?.setValue('Manchester United vs Liverpool');
        expect(title?.valid).toBe(true);
      });
    });

    describe('Description field', () => {
      it('should be invalid when empty', () => {
        const description = component.eventForm.get('description');
        description?.setValue('');
        expect(description?.hasError('required')).toBe(true);
        expect(description?.valid).toBe(false);
      });

      it('should be invalid when too short', () => {
        const description = component.eventForm.get('description');
        description?.setValue('a');
        expect(description?.hasError('minlength')).toBe(true);
        expect(description?.valid).toBe(false);
      });

      it('should be invalid when too long', () => {
        const description = component.eventForm.get('description');
        description?.setValue('a'.repeat(201));
        expect(description?.hasError('maxlength')).toBe(true);
        expect(description?.valid).toBe(false);
      });

      it('should be valid with correct length', () => {
        const description = component.eventForm.get('description');
        description?.setValue('Premier League match at Old Trafford');
        expect(description?.valid).toBe(true);
      });
    });

    describe('Team fields', () => {
      it('should be invalid when homeTeam is empty', () => {
        const homeTeam = component.eventForm.get('homeTeam');
        homeTeam?.setValue('');
        expect(homeTeam?.hasError('required')).toBe(true);
        expect(homeTeam?.valid).toBe(false);
      });

      it('should be invalid when awayTeam is empty', () => {
        const awayTeam = component.eventForm.get('awayTeam');
        awayTeam?.setValue('');
        expect(awayTeam?.hasError('required')).toBe(true);
        expect(awayTeam?.valid).toBe(false);
      });

      it('should be invalid when homeTeam is too short', () => {
        const homeTeam = component.eventForm.get('homeTeam');
        homeTeam?.setValue('a');
        expect(homeTeam?.hasError('minlength')).toBe(true);
      });

      it('should be invalid when awayTeam is too long', () => {
        const awayTeam = component.eventForm.get('awayTeam');
        awayTeam?.setValue('a'.repeat(51));
        expect(awayTeam?.hasError('maxlength')).toBe(true);
      });

      it('should be valid with correct team names', () => {
        const homeTeam = component.eventForm.get('homeTeam');
        const awayTeam = component.eventForm.get('awayTeam');
        homeTeam?.setValue('Manchester United');
        awayTeam?.setValue('Liverpool');
        expect(homeTeam?.valid).toBe(true);
        expect(awayTeam?.valid).toBe(true);
      });
    });

    describe('Odds fields', () => {
      it('should be invalid when homeOdds is below minimum', () => {
        const homeOdds = component.eventForm.get('homeOdds');
        homeOdds?.setValue(1.0);
        expect(homeOdds?.hasError('min')).toBe(true);
        expect(homeOdds?.valid).toBe(false);
      });

      it('should be invalid when awayOdds is above maximum', () => {
        const awayOdds = component.eventForm.get('awayOdds');
        awayOdds?.setValue(101);
        expect(awayOdds?.hasError('max')).toBe(true);
        expect(awayOdds?.valid).toBe(false);
      });

      it('should be valid with odds in range', () => {
        const homeOdds = component.eventForm.get('homeOdds');
        const awayOdds = component.eventForm.get('awayOdds');
        homeOdds?.setValue(2.5);
        awayOdds?.setValue(3.0);
        expect(homeOdds?.valid).toBe(true);
        expect(awayOdds?.valid).toBe(true);
      });

      it('should allow drawOdds to be empty', () => {
        const drawOdds = component.eventForm.get('drawOdds');
        drawOdds?.setValue(null);
        expect(drawOdds?.valid).toBe(true);
      });
    });

    describe('Other fields', () => {
      it('should require startTime', () => {
        const startTime = component.eventForm.get('startTime');
        startTime?.setValue(null);
        expect(startTime?.hasError('required')).toBe(true);
      });

      it('should require sport', () => {
        const sport = component.eventForm.get('sport');
        sport?.setValue('');
        expect(sport?.hasError('required')).toBe(true);
      });

      it('should require status', () => {
        const status = component.eventForm.get('status');
        status?.setValue('');
        expect(status?.hasError('required')).toBe(true);
      });
    });
  });

  describe('hasDraw getter', () => {
    it('should return true for football', () => {
      component.eventForm.get('sport')?.setValue('football');
      expect(component.hasDraw).toBe(true);
    });

    it('should return true for volleyball', () => {
      component.eventForm.get('sport')?.setValue('volleyball');
      expect(component.hasDraw).toBe(true);
    });

    it('should return false for basketball', () => {
      component.eventForm.get('sport')?.setValue('basketball');
      expect(component.hasDraw).toBe(false);
    });

    it('should return false for tennis', () => {
      component.eventForm.get('sport')?.setValue('tennis');
      expect(component.hasDraw).toBe(false);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Set up valid form data
      component.eventForm.patchValue({
        title: 'Manchester United vs Liverpool',
        description: 'Premier League match at Old Trafford',
        sport: 'football',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        startTime: new Date('2025-10-15T15:00:00'),
        status: 'upcoming',
        homeOdds: 2.5,
        drawOdds: 3.0,
        awayOdds: 2.8,
        isLive: false,
      });
    });

    it('should close dialog with event data when form is valid', () => {
      component.onSubmit();

      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      const passedEvent = dialogRefSpy.close.calls.argsFor(0)[0];

      expect(passedEvent).toEqual({
        title: 'Manchester United vs Liverpool',
        description: 'Premier League match at Old Trafford',
        sport: 'football',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        startTime: new Date('2025-10-15T15:00:00'),
        status: 'upcoming',
        odds: {
          home: 2.5,
          draw: 3.0,
          away: 2.8,
        },
        isLive: false,
      });
    });

    it('should set draw odds to undefined when null', () => {
      component.eventForm.patchValue({ drawOdds: null });
      component.onSubmit();

      const passedEvent = dialogRefSpy.close.calls.argsFor(0)[0];
      expect(passedEvent.odds.draw).toBeUndefined();
    });

    it('should not close dialog when form is invalid', () => {
      component.eventForm.patchValue({ title: '' }); // Make form invalid
      component.onSubmit();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should handle isLive checkbox correctly', () => {
      component.eventForm.patchValue({ isLive: true });
      component.onSubmit();

      const passedEvent = dialogRefSpy.close.calls.argsFor(0)[0];
      expect(passedEvent.isLive).toBe(true);
    });

    it('should handle different sports correctly', () => {
      component.eventForm.patchValue({ sport: 'basketball' });
      component.onSubmit();

      const passedEvent = dialogRefSpy.close.calls.argsFor(0)[0];
      expect(passedEvent.sport).toBe('basketball');
    });

    it('should handle different statuses correctly', () => {
      component.eventForm.patchValue({ status: 'live' });
      component.onSubmit();

      const passedEvent = dialogRefSpy.close.calls.argsFor(0)[0];
      expect(passedEvent.status).toBe('live');
    });
  });

  describe('onCancel', () => {
    it('should close dialog without data', () => {
      component.onCancel();

      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('Integration tests', () => {
    it('should have form invalid initially (empty required fields)', () => {
      component.eventForm.patchValue({
        title: '',
        description: '',
        homeTeam: '',
        awayTeam: '',
      });

      expect(component.eventForm.valid).toBe(false);
    });

    it('should have form valid with all required fields filled', () => {
      component.eventForm.patchValue({
        title: 'Test Match',
        description: 'Test Description',
        sport: 'football',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        startTime: new Date(),
        status: 'upcoming',
        homeOdds: 2.0,
        drawOdds: 3.0,
        awayOdds: 2.5,
        isLive: false,
      });

      expect(component.eventForm.valid).toBe(true);
    });

    it('should preserve form data between validation checks', () => {
      const testData = {
        title: 'Chelsea vs Arsenal',
        description: 'London Derby',
        homeTeam: 'Chelsea',
        awayTeam: 'Arsenal',
      };

      component.eventForm.patchValue(testData);

      expect(component.eventForm.get('title')?.value).toBe(testData.title);
      expect(component.eventForm.get('description')?.value).toBe(testData.description);
      expect(component.eventForm.get('homeTeam')?.value).toBe(testData.homeTeam);
      expect(component.eventForm.get('awayTeam')?.value).toBe(testData.awayTeam);
    });
  });

  describe('Constants', () => {
    it('should have sports array', () => {
      expect(component.sports).toEqual(['football', 'basketball', 'tennis', 'volleyball']);
    });

    it('should have statuses array', () => {
      expect(component.statuses).toEqual(['upcoming', 'live', 'finished']);
    });
  });
});
