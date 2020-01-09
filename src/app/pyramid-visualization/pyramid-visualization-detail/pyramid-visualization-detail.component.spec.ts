import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidVisualizationDetailComponent } from './pyramid-visualization-detail.component';

describe('PyramidVisualizationDetailComponent', () => {
  let component: PyramidVisualizationDetailComponent;
  let fixture: ComponentFixture<PyramidVisualizationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidVisualizationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidVisualizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
