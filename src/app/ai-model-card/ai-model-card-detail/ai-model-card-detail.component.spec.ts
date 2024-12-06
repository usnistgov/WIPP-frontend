import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelCardDetailComponent } from './ai-model-card-detail.component';

describe('AiModelCardDetailComponent', () => {
  let component: AiModelCardDetailComponent;
  let fixture: ComponentFixture<AiModelCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AiModelCardDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiModelCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
