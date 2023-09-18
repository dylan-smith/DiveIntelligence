import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivePlanComponent } from './dive-plan.component';

describe('DivePlanComponent', () => {
  let component: DivePlanComponent;
  let fixture: ComponentFixture<DivePlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivePlanComponent]
    });
    fixture = TestBed.createComponent(DivePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
