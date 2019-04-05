export class Job {
  id: string;
  name: string;
  creationDate: number;
  status: string;
  startTime: Date;
  endTime: Date;
  runningTime: Date;
  error: string;
  wippExecutable: string;
  dependencies: any[];
  parameters: JSON;
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
