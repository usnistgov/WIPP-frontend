import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidTemplateComponent } from './pyramid-template.component';

describe('PyramidTemplateComponent', () => {
  let component: PyramidTemplateComponent;
  let fixture: ComponentFixture<PyramidTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
