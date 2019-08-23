export class TensorflowModel {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  _links: any;
}

export interface PaginatedTensorflowModels {
  page: any;
  tensorflowModels: TensorflowModel[];
  _links: any;
}
