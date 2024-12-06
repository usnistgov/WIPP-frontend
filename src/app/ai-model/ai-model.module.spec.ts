import { AiModelModule } from './ai-model.module';

describe('AiModelModule', () => {
  let AiModelModule: AiModelModule;

  beforeEach(() => {
    AiModelModule = new AiModelModule();
  });

  it('should create an instance', () => {
    expect(AiModelModule).toBeTruthy();
  });
});
