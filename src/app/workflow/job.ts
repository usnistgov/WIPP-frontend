export class Job {
  id: string;
  name: string;
  creaionDate: number;
  status: string;
  endTime: string;
  error: string;
  wippExecutable: string;
  dependencies: any[];
  parameters: {};
  wippWorkflow: string;
  wippVersion: string;
  type: string;
  _links: any;
}

export interface PaginatedJobs {
  page: any;
  jobs: Job[];
  _links: any;
}
