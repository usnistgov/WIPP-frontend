import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelNewComponent } from './ai-model-new.component';

describe('AiModelNewComponent', () => {
  let component: AiModelNewComponent;
  let fixture: ComponentFixture<AiModelNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiModelNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiModelNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
