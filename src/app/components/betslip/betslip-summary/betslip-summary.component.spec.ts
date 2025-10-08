import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { BetslipSummaryComponent } from './betslip-summary.component';

describe('BetslipSummaryComponent', () => {
  let component: BetslipSummaryComponent;
  let fixture: ComponentFixture<BetslipSummaryComponent>;
  let componentRef: ComponentRef<BetslipSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetslipSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BetslipSummaryComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('totalStake', 100);
    componentRef.setInput('totalOdds', 2.5);
    componentRef.setInput('potentialWin', 250);
    componentRef.setInput('isPlaceBetDisabled', false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept all required inputs', () => {
    componentRef.setInput('totalStake', 150);
    componentRef.setInput('totalOdds', 3.0);
    componentRef.setInput('potentialWin', 450);
    componentRef.setInput('isPlaceBetDisabled', true);
    fixture.detectChanges();

    expect(component.totalStake()).toBe(150);
    expect(component.totalOdds()).toBe(3.0);
    expect(component.potentialWin()).toBe(450);
    expect(component.isPlaceBetDisabled()).toBe(true);
  });

  it('should emit placeBet when onPlaceBet is called', () => {
    componentRef.setInput('totalStake', 100);
    componentRef.setInput('totalOdds', 2.5);
    componentRef.setInput('potentialWin', 250);
    componentRef.setInput('isPlaceBetDisabled', false);
    fixture.detectChanges();

    const placeBetSpy = jasmine.createSpy('placeBet');
    component.placeBet.subscribe(placeBetSpy);

    component.onPlaceBet();

    expect(placeBetSpy).toHaveBeenCalled();
  });

  it('should emit clearBetslip when onClearBetslip is called', () => {
    componentRef.setInput('totalStake', 100);
    componentRef.setInput('totalOdds', 2.5);
    componentRef.setInput('potentialWin', 250);
    componentRef.setInput('isPlaceBetDisabled', false);
    fixture.detectChanges();

    const clearBetslipSpy = jasmine.createSpy('clearBetslip');
    component.clearBetslip.subscribe(clearBetslipSpy);

    component.onClearBetslip();

    expect(clearBetslipSpy).toHaveBeenCalled();
  });
});
