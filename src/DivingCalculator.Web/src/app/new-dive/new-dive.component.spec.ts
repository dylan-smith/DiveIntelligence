import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiveComponent } from './new-dive.component';

describe('NewDiveComponent', () => {
  let component: NewDiveComponent;
  let fixture: ComponentFixture<NewDiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDiveComponent]
    });
    fixture = TestBed.createComponent(NewDiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
