import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelDetailComponent } from './ai-model-detail.component';

describe('AiModelDetailComponent', () => {
  let component: AiModelDetailComponent;
  let fixture: ComponentFixture<AiModelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiModelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
