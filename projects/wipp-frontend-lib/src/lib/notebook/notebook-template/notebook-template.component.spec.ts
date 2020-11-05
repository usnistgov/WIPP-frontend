import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookTemplateComponent } from './notebook-template.component';

describe('NotebookTemplateComponent', () => {
  let component: NotebookTemplateComponent;
  let fixture: ComponentFixture<NotebookTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
