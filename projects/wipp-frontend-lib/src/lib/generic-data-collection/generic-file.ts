export class GenericFile {
    id: string;
    fileName: string;
    fileSize: number;
    importing: boolean;
    importError: string;
    _links: any;
  }

  export interface PaginatedGenericFiles {
    page: any;
    data: GenericFile[];
    _links: any;
  }
