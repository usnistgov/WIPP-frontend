export class ImageAnnotation {
  id: string;
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

export interface Label {
  name: string;
  color: string;
}
