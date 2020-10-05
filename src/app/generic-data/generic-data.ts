export class GenericData {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  type: string;
  description: string;
  owner: string;
  publiclyShared: boolean;
  _links: any;
}

export interface PaginatedGenericDatas {
  page: any;
  data: GenericData[];
  _links: any;
}
