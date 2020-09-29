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
  data: Notebook[];
  _links: any;
}
