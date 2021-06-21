import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowNewComponent } from './workflow-new.component';

describe('WorkflowNewComponent', () => {
  let component: WorkflowNewComponent;
  let fixture: ComponentFixture<WorkflowNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
