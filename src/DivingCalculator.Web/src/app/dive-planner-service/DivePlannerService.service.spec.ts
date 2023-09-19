import { TestBed } from '@angular/core/testing';

import { DivePlannerService } from './DivePlannerService';

describe('DivePlannerServiceService', () => {
  let service: DivePlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivePlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
