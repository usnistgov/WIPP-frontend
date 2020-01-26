export class Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  institution: string;
  repository: string;
  website: string;
  citation: string;
  creationDate: Date;
  containerId: string;
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
