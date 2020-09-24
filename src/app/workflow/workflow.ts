export class Workflow {
  id: string;
  name: string;
  creationDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  errorMessage: string;
  _links: any;
  generatedName: string;
  owner: string;
  publiclyShared: boolean;
}

export interface PaginatedWorkflows {
  page: any;
  workflows: Workflow[];
  _links: any;
}
