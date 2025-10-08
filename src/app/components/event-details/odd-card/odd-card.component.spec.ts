import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { OddCardComponent } from './odd-card.component';

describe('OddCardComponent', () => {
  let component: OddCardComponent;
  let fixture: ComponentFixture<OddCardComponent>;
  let componentRef: ComponentRef<OddCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OddCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OddCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('label', 'Home');
    componentRef.setInput('oddValue', 2.5);
    componentRef.setInput('isFinished', false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept all required inputs', () => {
    componentRef.setInput('label', 'Draw');
    componentRef.setInput('oddValue', 3.0);
    componentRef.setInput('isFinished', true);
    fixture.detectChanges();

    expect(component.label()).toBe('Draw');
    expect(component.oddValue()).toBe(3.0);
    expect(component.isFinished()).toBe(true);
  });

  it('should emit addToBetslip when onAddToBetslip is called', () => {
    componentRef.setInput('label', 'Away');
    componentRef.setInput('oddValue', 2.8);
    componentRef.setInput('isFinished', false);
    fixture.detectChanges();

    const addToBetslipSpy = jasmine.createSpy('addToBetslip');
    component.addToBetslip.subscribe(addToBetslipSpy);

    component.onAddToBetslip();

    expect(addToBetslipSpy).toHaveBeenCalled();
  });
});
