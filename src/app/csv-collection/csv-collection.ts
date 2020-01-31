export class CsvCollection {
  id: string;
  name: string;
  files: File[];
  creationDate: Date;
  sourceJob: string;
  _links: any;
}

export interface PaginatedCsvCollections {
  page: any;
  data: CsvCollection[];
  _links: any;
}
