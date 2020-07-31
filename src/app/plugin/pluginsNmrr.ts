// it will store the page retrieved from NMRR
export interface PluginsNmrr {
  count: number;
  next: string;
  previous: string;
  results: PluginNmrr[];
  _links: any;
}

// it will store each item in the plugin list
export class PluginNmrr {
  id: string;
  template: string;
  workspace: string;
  user_id: string;
  title: string;
  xml_content: string;
  last_modification_date: string;
  manifest: string;
  _links: any;
}
