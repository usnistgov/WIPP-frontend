export class Notebook {
  id: string;
  name: string;
  creationDate: Date;
  description: string;
  job: string;
  _links: any;
}

export interface PaginatedNotebooks {
  page: any;
  notebooks: Notebook[];
  _links: any;
}
