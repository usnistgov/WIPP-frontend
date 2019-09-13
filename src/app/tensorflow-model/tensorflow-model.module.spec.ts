import { TensorflowModelModule } from './tensorflow-model.module';

describe('TensorflowModelModule', () => {
  let tensorflowModelModule: TensorflowModelModule;

  beforeEach(() => {
    tensorflowModelModule = new TensorflowModelModule();
  });

  it('should create an instance', () => {
    expect(tensorflowModelModule).toBeTruthy();
  });
});
