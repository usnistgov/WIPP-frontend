import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataNewComponent } from './generic-data-new.component';

describe('GenericDataNewComponent', () => {
  let component: GenericDataNewComponent;
  let fixture: ComponentFixture<GenericDataNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDataNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
