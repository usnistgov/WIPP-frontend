import { CsvCollectionModule } from './csv-collection.module';

describe('CsvCollectionModule', () => {
  let csvCollectionModule: CsvCollectionModule;

  beforeEach(() => {
    csvCollectionModule = new CsvCollectionModule();
  });

  it('should create an instance', () => {
    expect(csvCollectionModule).toBeTruthy();
  });
});
