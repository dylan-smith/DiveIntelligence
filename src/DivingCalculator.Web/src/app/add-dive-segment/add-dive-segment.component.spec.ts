import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiveSegmentComponent } from './add-dive-segment.component';

describe('AddDiveSegmentComponent', () => {
  let component: AddDiveSegmentComponent;
  let fixture: ComponentFixture<AddDiveSegmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiveSegmentComponent],
    });
    fixture = TestBed.createComponent(AddDiveSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
