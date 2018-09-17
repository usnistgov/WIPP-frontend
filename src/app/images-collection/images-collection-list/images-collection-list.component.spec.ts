import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionListComponent } from './images-collection-list.component';

describe('ImagesCollectionListComponent', () => {
  let component: ImagesCollectionListComponent;
  let fixture: ComponentFixture<ImagesCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
