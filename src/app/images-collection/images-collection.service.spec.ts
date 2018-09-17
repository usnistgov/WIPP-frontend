import { TestBed, inject } from '@angular/core/testing';

import { ImagesCollectionService } from './images-collection.service';

describe('ImagesCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagesCollectionService]
    });
  });

  it('should be created', inject([ImagesCollectionService], (service: ImagesCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
