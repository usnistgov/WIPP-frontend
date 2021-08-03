import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataCollectionNewComponent } from './generic-data-collection-new.component';

describe('GenericDataCollectionNewComponent', () => {
  let component: GenericDataCollectionNewComponent;
  let fixture: ComponentFixture<GenericDataCollectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDataCollectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataCollectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
