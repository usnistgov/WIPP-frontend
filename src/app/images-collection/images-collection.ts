export class ImagesCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  locked: boolean;
  numberOfImages: number;
  imagesTotalSize: number;
  numberImportingImages: number;
  numberOfImportErrors: number;
  numberOfMetadataFiles: number;
  metadataFilesTotalSize: number;
  notes: string;
  pattern: string;
  owner: string;
  publiclyAvailable: boolean = true;
  _links: any;
}

export interface PaginatedImagesCollections {
  page: any;
  imagesCollections: ImagesCollection[];
  _links: any;
}
