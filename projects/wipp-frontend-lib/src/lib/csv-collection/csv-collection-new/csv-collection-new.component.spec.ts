import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvCollectionNewComponent } from './csv-collection-new.component';

describe('CsvCollectionNewComponent', () => {
  let component: CsvCollectionNewComponent;
  let fixture: ComponentFixture<CsvCollectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvCollectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvCollectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
