import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PluginsNmrr,PluginApi,PluginNmrr} from './pluginsNmrr';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {PaginatedStitchingVector} from '../stitching-vector/stitching-vector';
import {PaginatedPlugins, Plugin} from './plugin';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}).set("Access-Control-Allow-Origin", "*"),
  params: {}
};

@Injectable({
  providedIn: 'root'
})
export class NmrrApiService {

  constructor(private http: HttpClient) { }

  // get plugins from nmrr registry using it's api
  getPluginsFromNmrr(params?): Observable<PluginsNmrr> {
    if (params) {
      if(params.page){
        const httpParams = new HttpParams().set('page', params.page);
        httpOptions.params = httpParams;
      }
    }
    const transferObject ={"query": {"Resource.role.type":"Plugin"}};
    const jsonObject = JSON.stringify(transferObject);
    const httpParams = new HttpParams();
    return this.http.post<any>(environment.getUrl+'/query/',jsonObject,httpOptions);
  }

  // get plugins whose the name contains a patern
  getPluginsFromNmrrByName(params?): Observable<PluginsNmrr> {
    if (params) {
      if(params.page){
        const httpParams = new HttpParams().set('page', params.page);
        httpOptions.params = httpParams;
      }
    }
    const transferObject ={"query": {"Resource.role.type":"Plugin" , "Resource.role.title":{ "$regex": ".*"+params.name+".*", "$options" : "i" }}};
    const jsonObject = JSON.stringify(transferObject);
    const httpParams = new HttpParams();
    return this.http.post<any>(environment.getUrl+'/query/',jsonObject,httpOptions);
  }

/*
  getSoftwareDetail(params): Observable<FullSoftware> {
    if (params) {
      const id = params.id ? params.id : null;
      const httpParams = new HttpParams().set('id', id);
      httpOptions.params = httpParams;
    }
    return this.http.get<JSON>(this.apiUrl + '/get-full', httpOptions).pipe(
      map((result: any) => {
        return result;
      }));
  }

  getInfoFromdata(data:FullSoftware):Plugin{
    var parser=new DOMParser();
    var xmldoc = parser.parseFromString(data.xml_content,"text/xml");
    var rootElement = xmldoc.documentElement;
    var pluginElement = new Plugin();
    pluginElement.id = data.id;
    pluginElement.name = rootElement.getElementsByTagName("title")[0].innerHTML;
    //console.log(pluginElement.id+"    "+pluginElement.name);
    pluginElement.author = rootElement.getElementsByTagName("creator")[0].innerHTML;
    pluginElement.version = rootElement.getElementsByTagName("version")[0].innerHTML;
    pluginElement.description = rootElement.getElementsByTagName("description")[0].innerHTML;
    return pluginElement;
  }
*/
  // parse the xml retrieved from nmrr to get plugin data
  getPluginsFromdata(datas:PluginNmrr[]):PluginApi[]{
    var pluginList : PluginApi[] = [];
    for (var data of datas) {
        var parser=new DOMParser();
        var xmldoc = parser.parseFromString(data.xml_content,"text/xml");
        var rootElement = xmldoc.documentElement;
        var pluginXml = rootElement.getElementsByTagName("role");
        var pluginElement = new PluginApi();
        pluginElement.id = data.id;
        var pluginElement = new PluginApi();
        pluginElement.name = pluginXml[0].getElementsByTagName("title")[0].innerHTML;
        pluginElement.description = pluginXml[0].getElementsByTagName("description")[0].innerHTML;
        pluginElement.version = pluginXml[0].getElementsByTagName("version")[0].innerHTML;
        pluginElement.title = pluginXml[0].getElementsByTagName("title")[0].innerHTML;
        //pluginElement.author = pluginXml[0].getElementsByTagName("author")[0].innerHTML;
        //pluginElement.institution = pluginXml[0].getElementsByTagName("institution")[0].innerHTML;
        //pluginElement.repository = pluginXml[0].getElementsByTagName("repository")[0].innerHTML;
        //pluginElement.website = pluginXml[0].getElementsByTagName("website")[0].innerHTML;
        //pluginElement.citation = pluginXml[0].getElementsByTagName("citation")[0].innerHTML;
        //pluginElement.containerId = pluginXml[0].getElementsByTagName("containerId")[0].innerHTML;
        pluginElement.jsondata = pluginXml[0].getElementsByTagName("pluginManifest")[0].innerHTML;
        //console.log(pluginElement.jsondata);
        pluginList.push(pluginElement);
    }
    return pluginList;
  }

}
