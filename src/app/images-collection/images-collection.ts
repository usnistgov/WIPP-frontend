import {Tag} from './tag';

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
  numberOfTags: number;
  _links: any;
  metadataFilesTotalSize: number;
  pattern: string;
  tags: Tag[];
}

export interface PaginatedImagesCollections {
  page: any;
  imagesCollections: ImagesCollection[];
  _links: any;
}
