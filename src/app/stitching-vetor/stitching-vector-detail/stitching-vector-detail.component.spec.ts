import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchingVectorDetailComponent } from './stitching-vector-detail.component';

describe('StitchingVectorDetailComponent', () => {
  let component: StitchingVectorDetailComponent;
  let fixture: ComponentFixture<StitchingVectorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchingVectorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchingVectorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
