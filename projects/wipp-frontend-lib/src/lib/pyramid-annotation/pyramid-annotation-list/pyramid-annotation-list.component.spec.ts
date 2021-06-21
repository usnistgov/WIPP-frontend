import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidAnnotationListComponent } from './pyramid-annotation-list.component';

describe('PyramidAnnotationListComponent', () => {
  let component: PyramidAnnotationListComponent;
  let fixture: ComponentFixture<PyramidAnnotationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidAnnotationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidAnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
