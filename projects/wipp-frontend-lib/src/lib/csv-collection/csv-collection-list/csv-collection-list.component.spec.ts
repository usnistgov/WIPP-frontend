import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvCollectionListComponent } from './csv-collection-list.component';

describe('CsvCollectionListComponent', () => {
  let component: CsvCollectionListComponent;
  let fixture: ComponentFixture<CsvCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
