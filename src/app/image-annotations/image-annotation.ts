export class ImageAnnotation {
  id: string;
  imagesCollectionId: string;
  imageFileName: string;
  pending: boolean;
  taskId: string;
  datamuroFileName: string;
  annotoriousFileName: string;
  imageMask: ImageAnnotationMask;
  _links: any;
}

export interface ImageAnnotationMask {
  imagesCollectionId: string;
  imageFileName: string;
}

export interface PaginatedImageAnnotations {
  page: any;
  data: ImageAnnotation[];
  _links: any;
}
