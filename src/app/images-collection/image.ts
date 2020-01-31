export class Image {
  id: string;
  fileName: string;
  fileSize: number;
  importing: boolean;
  importError: string;
  _links: any;
}

export interface PaginatedImages {
  page: any;
  data: Image[];
  _links: any;
}
