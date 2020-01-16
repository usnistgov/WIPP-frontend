import { TestBed } from '@angular/core/testing';

import { PyramidVisualizationService } from './pyramid-visualization.service';

describe('PyramidVisualizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PyramidVisualizationService = TestBed.get(PyramidVisualizationService);
    expect(service).toBeTruthy();
  });
});
