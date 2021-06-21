import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidListComponent } from './pyramid-list.component';

describe('PyramidListComponent', () => {
  let component: PyramidListComponent;
  let fixture: ComponentFixture<PyramidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
