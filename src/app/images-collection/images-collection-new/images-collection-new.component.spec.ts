import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionNewComponent } from './images-collection-new.component';

describe('ImagesCollectionNewComponent', () => {
  let component: ImagesCollectionNewComponent;
  let fixture: ComponentFixture<ImagesCollectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCollectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
