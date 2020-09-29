export class Pyramid {
  id: string;
  name: string;
  creationDate: Date;
  job: string;
  _links: any;
}

export interface PaginatedPyramid {
  page: any;
  data: Pyramid[];
  _links: any;
}

