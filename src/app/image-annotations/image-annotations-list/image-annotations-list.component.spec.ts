import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnnotationsListComponent } from './image-annotations-list.component';

describe('ImageAnnotationsListComponent', () => {
  let component: ImageAnnotationsListComponent;
  let fixture: ComponentFixture<ImageAnnotationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAnnotationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageAnnotationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
