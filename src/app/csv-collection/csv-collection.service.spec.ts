import { TestBed, inject } from '@angular/core/testing';

import { CsvCollectionService } from './csv-collection.service';

describe('CsvCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsvCollectionService]
    });
  });

  it('should be created', inject([CsvCollectionService], (service: CsvCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
