import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionCreateAnnotTaskComponent } from './images-collection-create-annot-task.component';

describe('ImagesCollectionCreateAnnotTaskComponent', () => {
  let component: ImagesCollectionCreateAnnotTaskComponent;
  let fixture: ComponentFixture<ImagesCollectionCreateAnnotTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesCollectionCreateAnnotTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesCollectionCreateAnnotTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
