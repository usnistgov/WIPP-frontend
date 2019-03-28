import { TestBed, inject } from '@angular/core/testing';

import { StitchingVectorService } from './stitching-vector.service';

describe('StitchingVectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StitchingVectorService]
    });
  });

  it('should be created', inject([StitchingVectorService], (service: StitchingVectorService) => {
    expect(service).toBeTruthy();
  }));
});
