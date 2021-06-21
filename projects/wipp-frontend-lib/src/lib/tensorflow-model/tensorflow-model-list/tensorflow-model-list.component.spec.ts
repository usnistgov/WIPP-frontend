import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorflowModelListComponent } from './tensorflow-model-list.component';

describe('TensorflowModelListComponent', () => {
  let component: TensorflowModelListComponent;
  let fixture: ComponentFixture<TensorflowModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TensorflowModelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TensorflowModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
