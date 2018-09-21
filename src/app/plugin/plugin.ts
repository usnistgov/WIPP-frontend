export class Plugin {
  name: string;
  version: string;
  description: string;
  _links: any;
}

export interface PaginatedPlugins {
  page: any;
  plugins: Plugin[];
  _links: any;
}
