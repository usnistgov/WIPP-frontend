export class Notebook {
  id: string;
  name: string;
  creationDate: Date;
  description: string;
  job: string;
  owner: string;
  publiclyShared: boolean;
  _links: any;
}

export interface PaginatedNotebooks {
  page: any;
  data: Notebook[];
  _links: any;
}
