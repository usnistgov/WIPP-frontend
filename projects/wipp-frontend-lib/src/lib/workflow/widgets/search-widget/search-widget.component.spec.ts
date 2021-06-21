import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWidgetComponent } from './search-widget.component';

describe('SearchWidgetComponent', () => {
  let component: SearchWidgetComponent;
  let fixture: ComponentFixture<SearchWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
