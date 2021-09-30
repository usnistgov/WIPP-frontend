export class ImagesCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  sourceCatalog: string;
  importMethod: string;
  format: ImagesCollectionFormat;
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

export enum ImagesCollectionFormat {
  OMETIFF = 'OME-TIFF',
  OMEZARR = 'OME-ZARR',
  RAW = 'RAW'
}
