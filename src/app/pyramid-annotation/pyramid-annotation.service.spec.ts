import { TestBed } from '@angular/core/testing';

import { PyramidAnnotationService } from './pyramid-annotation.service';

describe('PyramidAnnotationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PyramidAnnotationService = TestBed.get(PyramidAnnotationService);
    expect(service).toBeTruthy();
  });
});
