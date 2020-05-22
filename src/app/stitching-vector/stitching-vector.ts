export class StitchingVector {
  id: string;
  name: string;
  creationDate: Date;
  pattern: string;
  note: string;
  file: File;
  job: string;
  numberOfTimeSlices: any;
  tilesPattern: any;
  owner: string;
  publiclyShared: boolean = true;
  _links: any;
}

export interface PaginatedStitchingVector {
  page: any;
  data: StitchingVector[];
  _links: any;
}
