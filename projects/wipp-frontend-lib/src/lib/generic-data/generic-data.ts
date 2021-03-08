export class GenericData {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyShared: boolean;
  type: string;
  description: string;
  locked: boolean;
  numberOfImportErrors: number;
  numberImportingGenericFiles: number;
  numberOfFiles: number;
  genericFileTotalSize: number;
  _links: any;
}

export interface PaginatedGenericDatas {
  page: any;
  data: GenericData[];
  _links: any;
}
