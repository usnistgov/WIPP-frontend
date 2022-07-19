export class ImagesCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  sourceCatalog: string;
  sourceBackendImport: string;
  importMethod: ImagesCollectionImportMethod;
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
  publiclyShared: boolean;
  _links: any;
}

export interface PaginatedImagesCollections {
  page: any;
  data: ImagesCollection[];
  _links: any;
}

export enum ImagesCollectionImportMethod {
  UPLOADED,
  JOB,
  CATALOG,
  BACKEND_IMPORT
}
