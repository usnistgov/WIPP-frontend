import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnnotationsDetailComponent } from './image-annotations-detail.component';

describe('ImageAnnotationsDetailComponent', () => {
  let component: ImageAnnotationsDetailComponent;
  let fixture: ComponentFixture<ImageAnnotationsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAnnotationsDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageAnnotationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
