import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidAnnotationDetailComponent } from './pyramid-annotation-detail.component';

describe('PyramidAnnotationDetailComponent', () => {
  let component: PyramidAnnotationDetailComponent;
  let fixture: ComponentFixture<PyramidAnnotationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidAnnotationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidAnnotationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
