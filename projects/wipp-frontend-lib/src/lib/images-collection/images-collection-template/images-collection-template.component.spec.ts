import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionTemplateComponent } from './images-collection-template.component';

describe('ImagesCollectionTemplateComponent', () => {
  let component: ImagesCollectionTemplateComponent;
  let fixture: ComponentFixture<ImagesCollectionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCollectionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
