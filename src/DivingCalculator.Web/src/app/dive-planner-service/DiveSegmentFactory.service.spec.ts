import { TestBed } from '@angular/core/testing';

import { DiveSegmentFactoryService } from './DiveSegmentFactory.service';

describe('DiveSegmentFactoryService', () => {
  let service: DiveSegmentFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiveSegmentFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
