import { TestBed } from '@angular/core/testing';

import { NmrrApiService } from './nmrr-api.service';

describe('NmrrApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NmrrApiService = TestBed.get(NmrrApiService);
    expect(service).toBeTruthy();
  });
});
