import {Injectable, Inject} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PaginatedPlugins, Plugin} from './plugin';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ENV } from '../injection-token';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({providedIn: 'root'})
export class PluginService {
  private httpExternal: HttpClient;

  constructor(@Inject(ENV) private env: any, 
              private http: HttpClient, 
              private httpBackend: HttpBackend) {
                this.httpExternal = new HttpClient(httpBackend);
              }

  private pluginsUrl = this.env.apiRootUrl + '/plugins';
  private pluginsUiPath = this.env.uiPaths.pluginsPath;

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
    return this.httpExternal.get<JSON>(url);
  }

  deletePlugin(plugin: Plugin) {
    return this.http.delete<Plugin>(plugin._links.self.href);
  }

  getPluginsUiPath(): string {
    return this.pluginsUiPath;
  }
  
}
