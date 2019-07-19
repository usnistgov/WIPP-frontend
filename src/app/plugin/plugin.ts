export class Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  creator: string;
  creationDate: Date;
  containerId: string;
  identifier: string;
  title: string;
  inputs: JSON[];
  outputs: JSON[];
  ui: JSON[];
  _links: any;
}

export interface PaginatedPlugins {
  page: any;
  plugins: Plugin[];
  _links: any;
}
