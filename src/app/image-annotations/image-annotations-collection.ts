export class ImageAnnotationsCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyShared: boolean;
  taskId: string;
  _links: any;
}

export interface PaginatedImageAnnotationsCollections {
  page: any;
  data: ImageAnnotationsCollection[];
  _links: any;
}
