import { WorkflowModule } from './workflow.module';

describe('WorkflowModule', () => {
  let workflowModule: WorkflowModule;

  beforeEach(() => {
    workflowModule = new WorkflowModule();
  });

  it('should create an instance', () => {
    expect(workflowModule).toBeTruthy();
  });
});
