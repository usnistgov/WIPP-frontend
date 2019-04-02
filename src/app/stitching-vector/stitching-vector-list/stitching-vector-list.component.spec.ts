import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StitchingVectorListComponent } from './stitching-vector-list.component';

describe('StitchingVectorListComponent', () => {
  let component: StitchingVectorListComponent;
  let fixture: ComponentFixture<StitchingVectorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StitchingVectorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StitchingVectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
