import { TestBed } from '@angular/core/testing';

import { GenericDataService } from './generic-data.service';

describe('GenericDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericDataService = TestBed.get(GenericDataService);
    expect(service).toBeTruthy();
  });
});
