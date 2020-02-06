export interface Softwares {
  count: number;
  next: string;
  previous: string;
  results: Software[];
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

export class Software {
  id: string;
  template: string;
  workspace: string;
  user_id:string;
  title:string;
  xml_content:string;
  last_modification_date:string;
  _links: any;

}

export class PlugginApi {
  id: string;
  name: string;
  description: string;
  jsondata :string;
}
