export class StitchingVector {
  id: string;
  name: string;
  creationDate: Date;
  pattern: string;
  note: string;
  file: File;

  _links: any;
}

export interface PaginatedStitchingVector {
  page: any;
  stitchingVectors: StitchingVector[];
  _links: any;
}
