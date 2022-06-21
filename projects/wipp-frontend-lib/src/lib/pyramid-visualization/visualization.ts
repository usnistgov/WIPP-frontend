export class Visualization {
  id: string;
  name: string;
  creationDate: Date;
  manifest: any;
  owner: string;
  publiclyShared: boolean = true;
  _links: any;
}

export interface PaginatedVisualization {
  page: any;
  data: Visualization[];
  _links: any;
}
