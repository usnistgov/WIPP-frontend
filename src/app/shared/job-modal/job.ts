export class Job {
  id: string;
  name: string;
  creationDate: number;
  status: string;
  startTime: string;
  endTime: string;
  runningTime: string;
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
