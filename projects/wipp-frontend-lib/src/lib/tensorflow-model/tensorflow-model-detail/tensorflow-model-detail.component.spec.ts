import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorflowModelDetailComponent } from './tensorflow-model-detail.component';

describe('TensorflowModelDetailComponent', () => {
  let component: TensorflowModelDetailComponent;
  let fixture: ComponentFixture<TensorflowModelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TensorflowModelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TensorflowModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
