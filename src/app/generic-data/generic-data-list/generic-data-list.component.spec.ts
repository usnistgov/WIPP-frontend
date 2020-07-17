import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataListComponent } from './generic-data-list.component';

describe('GenericDataListComponent', () => {
  let component: GenericDataListComponent;
  let fixture: ComponentFixture<GenericDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
