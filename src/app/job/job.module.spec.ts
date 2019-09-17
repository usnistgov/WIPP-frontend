import { JobModule } from './job.module';

describe('JobModule', () => {
  let jobModule: JobModule;

  beforeEach(() => {
    jobModule = new JobModule();
  });

  it('should create an instance', () => {
    expect(jobModule).toBeTruthy();
  });
});
