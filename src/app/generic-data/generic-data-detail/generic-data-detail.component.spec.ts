import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataDetailComponent } from './generic-data-detail.component';

describe('GenericDataDetailComponent', () => {
  let component: GenericDataDetailComponent;
  let fixture: ComponentFixture<GenericDataDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDataDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
