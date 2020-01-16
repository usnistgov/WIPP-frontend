export class CsvCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyAvailable: boolean = true;
  _links: any;
}

export interface PaginatedCsvCollections {
  page: any;
  csvCollections: CsvCollection[];
  _links: any;
}
