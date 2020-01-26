import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PaginatedPlugins, Plugin} from './plugin';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {PaginatedStitchingVector} from '../stitching-vector/stitching-vector';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({providedIn: 'root'})
export class PluginService {
  constructor(
    private http: HttpClient
  ) {
  }

  private pluginsUrl = environment.apiRootUrl + '/plugins';

  getPlugins(params): Observable<PaginatedPlugins> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.pluginsUrl, httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  getPluginsByNameContainingIgnoreCase(params, name): Observable<PaginatedPlugins> {
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.pluginsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  getAllPluginsOrderedByName(): Observable<PaginatedPlugins> {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    return this.http.get<any>(this.pluginsUrl + '/search/findByOrderByNameAsc', httpOptions).pipe(
      map((result: any) => {
        result.plugins = result._embedded.plugins;
        return result;
      }));
  }

  postPlugin(pluginDescriptor): Observable<Plugin> {
    const httpParams = new HttpParams();
    httpOptions.params = httpParams;
    return this.http.post<Plugin>(this.pluginsUrl,
      pluginDescriptor,
      httpOptions
    );
  }

  getPlugin(id): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.pluginsUrl}/${id}`);
  }

  getPluginInputType(plugin: Plugin, inputName: string): string {
    for (const pluginInput of plugin.inputs) {
      if (pluginInput['name'] = inputName) {
        return (pluginInput['type']);
      }
    }
  }

  getPluginInputKeys(plugin: Plugin): string[] {
    const inputKeys: string[] = [];
    for (const pluginInput of plugin.inputs) {
      inputKeys.push(pluginInput['name']);
    }
    return (inputKeys);
  }

    getPluginOutputKeys(plugin: Plugin): string[] {
    const outputKeys: string[] = [];
    for (const pluginInput of plugin.outputs) {
      outputKeys.push(pluginInput['name']);
    }
    return (outputKeys);
  }

  getJsonFromURL(url: string): Observable<JSON> {
    return this.http.get<JSON>(url);
  }

  getPluginsByCategory(category: string) {
    let pluginList = [];
    this.getAllPluginsOrderedByName()
      .subscribe(plugins => {
        pluginList = plugins.plugins;
      });
    return pluginList.find(x => x.category == category);;
  }

  getAllInstitutions(): string[] {
    let pluginList;
    let institutionList: string[];
    this.getAllPluginsOrderedByName().subscribe(plugins => {
      pluginList = plugins.plugins;
    });
    for(let plugin of pluginList) {
      institutionList.push(plugin.institution);
    }
    institutionList = institutionList.filter((n,i) => institutionList.indexOf(n)===i);
    return institutionList;
  }
}
