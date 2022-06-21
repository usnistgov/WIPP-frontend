export class Csv {
  id: string;
  fileName: string;
  fileSize: number;
  importing: boolean;
  importError: string;
  _links: any;
}

export interface PaginatedCsv {
  page: any;
  data: Csv[];
  _links: any;
}
