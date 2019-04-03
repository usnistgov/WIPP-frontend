import { StitchingVectorModule } from './stitching-vector.module';

describe('StitchingVectorModule', () => {
  let stitchingVectorModule: StitchingVectorModule;

  beforeEach(() => {
    stitchingVectorModule = new StitchingVectorModule();
  });

  it('should create an instance', () => {
    expect(stitchingVectorModule).toBeTruthy();
  });
});
