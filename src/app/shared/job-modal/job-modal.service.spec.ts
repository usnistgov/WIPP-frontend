import { TestBed, inject } from '@angular/core/testing';

import { JobModalService } from './job-modal.service';

describe('JobModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobModalService]
    });
  });

  it('should be created', inject([JobModalService], (service: JobModalService) => {
    expect(service).toBeTruthy();
  }));
});
