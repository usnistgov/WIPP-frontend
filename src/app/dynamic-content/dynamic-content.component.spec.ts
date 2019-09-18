import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentComponent } from './dynamic-content.component';

describe('DynamicContentComponent', () => {
  let component: DynamicContentComponent;
  let fixture: ComponentFixture<DynamicContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
