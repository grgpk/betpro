import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { EventFiltersComponent, FilterValues } from './event-filters.component';
import { Sport, EventStatus } from '../types';

describe('EventFiltersComponent', () => {
  let component: EventFiltersComponent;
  let fixture: ComponentFixture<EventFiltersComponent>;
  let componentRef: ComponentRef<EventFiltersComponent>;

  const mockSports: Sport[] = ['football', 'basketball'];
  const mockStatuses: EventStatus[] = ['upcoming', 'live', 'finished'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFiltersComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept sports and statuses inputs', () => {
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    fixture.detectChanges();

    expect(component.sports()).toEqual(mockSports);
    expect(component.statuses()).toEqual(mockStatuses);
  });

  it('should patch form with initialValues', () => {
    const initialValues: FilterValues = {
      sport: 'football',
      status: 'upcoming',
      dateFrom: null,
      dateTo: null,
    };

    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    componentRef.setInput('initialValues', initialValues);
    fixture.detectChanges();

    expect(component.filterForm.value.sport).toBe('football');
    expect(component.filterForm.value.status).toBe('upcoming');
  });

  it('should emit filtersChanged when form values change', fakeAsync(() => {
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    fixture.detectChanges();

    const filtersChangedSpy = jasmine.createSpy('filtersChanged');
    component.filtersChanged.subscribe(filtersChangedSpy);

    component.filterForm.patchValue({ sport: 'basketball' });
    tick(300);

    expect(filtersChangedSpy).toHaveBeenCalledWith({
      sport: 'basketball',
      status: '',
      dateFrom: null,
      dateTo: null,
    });
  }));

  it('should reset form and emit clearFiltersClicked when onClearFilters is called', () => {
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    fixture.detectChanges();

    component.filterForm.patchValue({ sport: 'football', status: 'live' });

    const clearFiltersClickedSpy = jasmine.createSpy('clearFiltersClicked');
    component.clearFiltersClicked.subscribe(clearFiltersClickedSpy);

    component.onClearFilters();

    expect(component.filterForm.value.sport).toBeNull();
    expect(component.filterForm.value.status).toBeNull();
    expect(clearFiltersClickedSpy).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    componentRef.setInput('sports', mockSports);
    componentRef.setInput('statuses', mockStatuses);
    fixture.detectChanges();

    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
