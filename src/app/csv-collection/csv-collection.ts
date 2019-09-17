export class CsvCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  _links: any;
}

export interface PaginatedCsvCollections {
  page: any;
  csvCollections: CsvCollection[];
  _links: any;
}
