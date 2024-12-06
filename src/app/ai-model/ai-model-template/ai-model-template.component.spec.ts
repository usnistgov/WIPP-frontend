import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelTemplateComponent } from './ai-model-template.component';

describe('AiModelTemplateComponent', () => {
  let component: AiModelTemplateComponent;
  let fixture: ComponentFixture<AiModelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiModelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiModelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
