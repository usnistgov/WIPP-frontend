import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorflowModelTemplateComponent } from './tensorflow-model-template.component';

describe('TensorflowModelTemplateComponent', () => {
  let component: TensorflowModelTemplateComponent;
  let fixture: ComponentFixture<TensorflowModelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TensorflowModelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TensorflowModelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
