import { TestBed, inject } from '@angular/core/testing';

import { TensorflowModelService } from './tensorflow-model.service';

describe('TensorflowModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TensorflowModelService]
    });
  });

  it('should be created', inject([TensorflowModelService], (service: TensorflowModelService) => {
    expect(service).toBeTruthy();
  }));
});
