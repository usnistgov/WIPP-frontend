import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvCollectionTemplateComponent } from './csv-collection-template.component';

describe('CsvCollectionTemplateComponent', () => {
  let component: CsvCollectionTemplateComponent;
  let fixture: ComponentFixture<CsvCollectionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvCollectionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvCollectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
