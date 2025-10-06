import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OddCardComponent } from './odd-card.component';

describe('OddCardComponent', () => {
  let component: OddCardComponent;
  let fixture: ComponentFixture<OddCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OddCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OddCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Home Team');
    fixture.componentRef.setInput('oddValue', 1.5);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label and odd value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Home Team');
    expect(compiled.textContent).toContain('1.5');
  });

  it('should emit addToBetslip when button is clicked', () => {
    let emitted = false;
    component.addToBetslip.subscribe(() => (emitted = true));

    component.onAddToBetslip();

    expect(emitted).toBe(true);
  });
});
