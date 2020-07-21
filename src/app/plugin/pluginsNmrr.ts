//it will store the page retrieved from NMRR
export interface PluginsNmrr {
  count: number;
  next: string;
  previous: string;
  results: PluginNmrr[];
  _links: any;
}

/*
export class FullSoftware {
  id: any;
  template: Template;
  user_id:String;
  title:String;
  xml_content:string;
  last_modification_date:String;
  _links: any;
}

export class Template{
   id:String;
   filename:String;
   content:String;
   hash:String;
   _display_name:String;
   dependencies:String[];
   _cls:String;
   _links: any;
}*/

//it will store each item in the plugin list
export class PluginNmrr {
  id: string;
  template: string;
  workspace: string;
  user_id:string;
  title:string;
  xml_content:string;
  last_modification_date:string;
  _links: any;

}


// xml data
export class PluginApi {
  id: string;
  name: string;
  description: string;
  version: string;
  title: string;
  author: string;
  institution: string;
  repository: string;
  website: string;
  citation: string;
  containerId: string;
  jsondata :string;
}
