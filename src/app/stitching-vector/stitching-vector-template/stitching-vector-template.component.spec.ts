import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchingVectorTemplateComponent } from './stitching-vector-template.component';

describe('StitchingVectorTemplateComponent', () => {
  let component: StitchingVectorTemplateComponent;
  let fixture: ComponentFixture<StitchingVectorTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchingVectorTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchingVectorTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
