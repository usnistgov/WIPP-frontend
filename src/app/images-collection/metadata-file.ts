export class MetadataFile {
  id: string;
  fileName: string;
  fileSize: number;
  _links: any;
}

export interface PaginatedMetadataFiles {
  page: any;
  metadataFiles: MetadataFile[];
  _links: any;
}
