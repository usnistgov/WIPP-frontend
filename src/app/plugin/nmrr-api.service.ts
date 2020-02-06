import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Softwares,PlugginApi,Software} from './softwares';
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

  private apiUrl ='http://127.0.0.1:8111/rest/data';
  private getUrl ='http://mgi_superuser:mgi_superuser_pwd@localhost:8111/rest/data';



  getApiSoftwares(params?): Observable<Softwares> {
    if (params) {
      if(params.page){
        const httpParams = new HttpParams().set('page', params.page);
        httpOptions.params = httpParams;
      }
    }
    const transferObject ={"query": {"Resource.role.type":"Pluggin"}};
    const jsonObject = JSON.stringify(transferObject);
    const httpParams = new HttpParams();
    return this.http.post<any>(this.getUrl+'/query/',jsonObject,httpOptions);
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
  getPluginsFromdata(datas:Software[]):PlugginApi[]{
    var pluginList : PlugginApi[] = [];
    for (var data of datas) {
        var parser=new DOMParser();
        var xmldoc = parser.parseFromString(data.xml_content,"text/xml");
        var rootElement = xmldoc.documentElement;
        var pluginElement = new PlugginApi();
        pluginElement.id = data.id;
        pluginElement.name = rootElement.getElementsByTagName("title")[0].innerHTML;
        pluginElement.description = rootElement.getElementsByTagName("description")[0].innerHTML;
        pluginElement.jsondata = rootElement.getElementsByTagName("plugginData")[0].innerHTML;
        console.log(pluginElement.jsondata);
        pluginList.push(pluginElement);
    }
    return pluginList;
  }

}
