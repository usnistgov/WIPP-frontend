import {PyramidModule} from './pyramid.module';

describe('PyramidModule', () => {
  let pyramidModule: PyramidModule;

  beforeEach(() => {
    pyramidModule = new PyramidModule();
  });

  it('should create an instance', () => {
    expect(PyramidModule).toBeTruthy();
  });
});
