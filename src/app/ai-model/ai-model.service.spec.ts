import { TestBed, inject } from '@angular/core/testing';

import { AiModelService } from './ai-model.service';

describe('AiModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiModelService]
    });
  });

  it('should be created', inject([AiModelService], (service: AiModelService) => {
    expect(service).toBeTruthy();
  }));
});
