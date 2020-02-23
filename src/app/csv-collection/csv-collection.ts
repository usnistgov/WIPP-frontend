export class CsvCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyAvailable: boolean = true;
  locked: boolean;
  numberOfImportErrors: number;
  numberImportingCsv: number;
  numberOfCsvFiles: number;
  csvTotalSize: number;
  _links: any;
}

export interface PaginatedCsvCollections {
  page: any;
  data: CsvCollection[];
  _links: any;
}
