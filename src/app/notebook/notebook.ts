export class Notebook {
  id: string;
  name: string;
  creationDate: Date;
  job: string;
  _links: any;
}

export interface PaginatedNotebooks {
  page: any;
  notebooks: Notebook[];
  _links: any;
}
