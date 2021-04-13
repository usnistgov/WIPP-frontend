import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenAccessComponent } from './forbidden-access.component';

describe('ForbiddenAccessComponent', () => {
  let component: ForbiddenAccessComponent;
  let fixture: ComponentFixture<ForbiddenAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForbiddenAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
