import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchingVectorNewComponent } from './stitching-vector-new.component';

describe('StitchingVectorNewComponent', () => {
  let component: StitchingVectorNewComponent;
  let fixture: ComponentFixture<StitchingVectorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchingVectorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchingVectorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
