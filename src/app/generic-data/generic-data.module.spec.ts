import { GenericDataModule } from './generic-data.module';

describe('GenericDataModule', () => {
  let genericDataModule: GenericDataModule;

  beforeEach(() => {
    genericDataModule = new GenericDataModule();
  });

  it('should create an instance', () => {
    expect(genericDataModule).toBeTruthy();
  });
});
