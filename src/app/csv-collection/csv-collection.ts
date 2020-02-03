export class CsvCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  locked: boolean;
  numberOfImportErrors: number;
  numberImportingCsv: number;
  csvTotalSize: number;
  _links: any;
}

export interface PaginatedCsvCollections {
  page: any;
  data: CsvCollection[];
  _links: any;
}
