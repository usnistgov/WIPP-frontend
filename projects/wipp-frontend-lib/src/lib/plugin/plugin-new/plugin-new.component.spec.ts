import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginNewComponent } from './plugin-new.component';

describe('PluginNewComponent', () => {
  let component: PluginNewComponent;
  let fixture: ComponentFixture<PluginNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
