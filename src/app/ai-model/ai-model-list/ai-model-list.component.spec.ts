import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelListComponent } from './ai-model-list.component';

describe('AiModelListComponent', () => {
  let component: AiModelListComponent;
  let fixture: ComponentFixture<AiModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AiModelListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
