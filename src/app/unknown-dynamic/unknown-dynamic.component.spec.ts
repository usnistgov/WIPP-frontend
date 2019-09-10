import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownDynamicComponent } from './unknown-dynamic.component';

describe('UnknownDynamicComponent', () => {
  let component: UnknownDynamicComponent;
  let fixture: ComponentFixture<UnknownDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnknownDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnknownDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
