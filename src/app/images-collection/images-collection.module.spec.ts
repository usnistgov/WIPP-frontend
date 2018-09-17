import { ImagesCollectionModule } from './images-collection.module';

describe('ImagesCollectionModule', () => {
  let imagesCollectionModule: ImagesCollectionModule;

  beforeEach(() => {
    imagesCollectionModule = new ImagesCollectionModule();
  });

  it('should create an instance', () => {
    expect(imagesCollectionModule).toBeTruthy();
  });
});
