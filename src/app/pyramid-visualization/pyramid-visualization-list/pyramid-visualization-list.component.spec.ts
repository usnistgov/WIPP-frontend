import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidVisualizationListComponent } from './pyramid-visualization-list.component';

describe('PyramidVisualizationListComponent', () => {
  let component: PyramidVisualizationListComponent;
  let fixture: ComponentFixture<PyramidVisualizationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidVisualizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidVisualizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
