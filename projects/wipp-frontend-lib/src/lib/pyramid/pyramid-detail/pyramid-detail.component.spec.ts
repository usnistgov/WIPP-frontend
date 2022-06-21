import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidDetailComponent } from './pyramid-detail.component';

describe('PyramidDetailComponent', () => {
  let component: PyramidDetailComponent;
  let fixture: ComponentFixture<PyramidDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
