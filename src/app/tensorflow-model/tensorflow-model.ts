export class TensorflowModel {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyAvailable: boolean = true;
  _links: any;
}

export interface PaginatedTensorflowModels {
  page: any;
  tensorflowModels: TensorflowModel[];
  _links: any;
}

export class TensorboardLogs {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  owner: string;
  publiclyAvailable: boolean = true;
  _links: any;
}
