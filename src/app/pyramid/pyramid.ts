export class Pyramid {
  id: string;
  name: string;
  creationDate: Date;
  job: string;
  owner: string;
  publiclyAvailable: boolean = true;
  _links: any;
}

export interface PaginatedPyramid {
  page: any;
  data: Pyramid[];
  _links: any;
}

