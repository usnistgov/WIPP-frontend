import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidVisualizationNewComponent } from './pyramid-visualization-new.component';

describe('PyramidVisualizationNewComponent', () => {
  let component: PyramidVisualizationNewComponent;
  let fixture: ComponentFixture<PyramidVisualizationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidVisualizationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidVisualizationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
