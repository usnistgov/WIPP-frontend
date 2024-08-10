import { TestBed } from '@angular/core/testing';

import { ImageAnnotationsService } from './image-annotations.service';

describe('ImageAnnotationsService', () => {
  let service: ImageAnnotationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageAnnotationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
