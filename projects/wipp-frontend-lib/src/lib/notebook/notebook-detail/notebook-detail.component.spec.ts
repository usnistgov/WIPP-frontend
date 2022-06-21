import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookDetailComponent } from './notebook-detail.component';

describe('NotebookDetailComponent', () => {
  let component: NotebookDetailComponent;
  let fixture: ComponentFixture<NotebookDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
