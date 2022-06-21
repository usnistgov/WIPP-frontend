import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidAnnotationTemplateComponent } from './pyramid-annotation-template.component';

describe('PyramidAnnotationTemplateComponent', () => {
  let component: PyramidAnnotationTemplateComponent;
  let fixture: ComponentFixture<PyramidAnnotationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidAnnotationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidAnnotationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
