export class PyramidAnnotation {
  id: string;
  name: string;
  creationDate: Date;
  note: string;
  file: File;
  job: string;
  numberOfTimeSlices: any;
  owner: string;
  publiclyShared: boolean;
  _links: any;
}

export interface PaginatedPyramidAnnotation {
  page: any;
  data: PyramidAnnotation[];
  _links: any;
}
