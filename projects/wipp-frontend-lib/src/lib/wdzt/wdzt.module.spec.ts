import { WdztModule } from './wdzt.module';

describe('WdztModule', () => {
  let wdztModule: WdztModule;

  beforeEach(() => {
    wdztModule = new WdztModule();
  });

  it('should create an instance', () => {
    expect(wdztModule).toBeTruthy();
  });
});
