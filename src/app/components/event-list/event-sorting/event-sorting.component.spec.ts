import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { EventSortingComponent } from './event-sorting.component';
import { EventSort } from '../../../models/filters.model';

describe('EventSortingComponent', () => {
  let component: EventSortingComponent;
  let fixture: ComponentFixture<EventSortingComponent>;
  let componentRef: ComponentRef<EventSortingComponent>;

  const mockSort: EventSort = {
    field: 'title',
    direction: 'asc',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSortingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSortingComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept currentSort input', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    expect(component.currentSort()).toEqual(mockSort);
  });

  it('should emit sortChanged with title when onSortClick is called with title', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    const sortChangedSpy = jasmine.createSpy('sortChanged');
    component.sortChanged.subscribe(sortChangedSpy);

    component.onSortClick('title');

    expect(sortChangedSpy).toHaveBeenCalledWith('title');
  });

  it('should emit sortChanged with startTime when onSortClick is called with startTime', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    const sortChangedSpy = jasmine.createSpy('sortChanged');
    component.sortChanged.subscribe(sortChangedSpy);

    component.onSortClick('startTime');

    expect(sortChangedSpy).toHaveBeenCalledWith('startTime');
  });

  it('should emit sortChanged with sport when onSortClick is called with sport', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    const sortChangedSpy = jasmine.createSpy('sortChanged');
    component.sortChanged.subscribe(sortChangedSpy);

    component.onSortClick('sport');

    expect(sortChangedSpy).toHaveBeenCalledWith('sport');
  });

  it('should emit sortChanged with status when onSortClick is called with status', () => {
    componentRef.setInput('currentSort', mockSort);
    fixture.detectChanges();

    const sortChangedSpy = jasmine.createSpy('sortChanged');
    component.sortChanged.subscribe(sortChangedSpy);

    component.onSortClick('status');

    expect(sortChangedSpy).toHaveBeenCalledWith('status');
  });
});
