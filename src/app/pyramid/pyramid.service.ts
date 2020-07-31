import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {PaginatedPyramid, Pyramid} from './pyramid';
import {DataService} from '../data-service';

@Injectable({
  providedIn: 'root'
})
export class PyramidService implements DataService<Pyramid, PaginatedPyramid> {
  private pyramidsUrl = environment.apiRootUrl + '/pyramids';
  private pyramidAnnotationsUrl = environment.apiRootUrl + '/pyramidAnnotations';

  constructor(
    private http: HttpClient) {
  }

  getById(id: string): Observable<Pyramid> {
    return this.http.get<Pyramid>(`${this.pyramidsUrl}/${id}`);
  }

  get(params): Observable<PaginatedPyramid> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.pyramidsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.pyramids;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedPyramid> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };

    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.pyramidsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.pyramids;
        return result;
      }));
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  getPyramidManifest(pyramid: Pyramid): any {
    const manifest = {
      'layersGroups': [{
        'id': pyramid.id,
        'name': pyramid.name,
        'layers': [{
          'id': pyramid.id,
          'name': pyramid.name,
          'baseUrl': pyramid._links.baseUri.href,
          'framesPrefix': '',
          'framesSuffix': '.dzi',
          'framesOffset': -1,
          'openOnFrame': 1,
          'numberOfFrames': 5,
          'paddingSize': 1,
          'fetching': {
            'url': pyramid._links.fetching.href
          },
          'pyramidAnnotations': {
            'serviceUrl': this.pyramidAnnotationsUrl
          }
        }]
      }]
    };
    const layer: any = manifest.layersGroups[0].layers[0];

    return forkJoin(
      this.getPyramidTimeSlices(pyramid, {
        size: 1,
        sort: 'name,asc'
      }),
      this.getPyramidTimeSlices(pyramid, {
        size: 1,
        sort: 'name,desc'
      }))
      .pipe(
        map(results => {
          layer.numberOfFrames = results[0].page.totalElements;
          for (let i = 0; i < results.length; i++) {
            if (results[i].pyramidTimeSlices) {
              results[i] = results[i].pyramidTimeSlices;
            } else {
              throw Error('No time slice found.');
            }
          }
          return results;
        }),
        map(timeSlicesArray => {
          const firstTimeSlice = timeSlicesArray[0][0];
          const firstTimeSliceNumber = Number(firstTimeSlice.name);
          if (isNaN(firstTimeSliceNumber)) {
            layer.baseUrl = firstTimeSlice._links.dzi.href;
            layer.singleFrame = true;
          }
          const lastTimeSlice = timeSlicesArray[1][0];
          const lastTimeSliceNumber = Number(lastTimeSlice.name);

          layer.paddingSize = firstTimeSlice.name.length;
          if (lastTimeSliceNumber - firstTimeSliceNumber + 1 ===
            layer.numberOfFrames) {
            layer.framesOffset = firstTimeSliceNumber - 1;
          } else {
            return this.getPyramidTimeSlices(pyramid, {
              size: layer.numberOfFrames
            }).pipe(
              map(resource => resource.pyramidTimeSlices),
              map(timeSlices => {
                layer.numberOfFrames = lastTimeSliceNumber;
                layer.framesList = timeSlices.map(function (timeSlice) {
                  return Number(timeSlice.name);
                });
                return firstTimeSlice;
              }));
          }
          return firstTimeSlice;
        }),
        map( data => {
          return manifest;
        }));
  }

  getPyramidTimeSlices(pyramid: Pyramid, params): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };

    let httpParams = new HttpParams();
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    if (pyramid._links['timeSlices']) {
      return this.http.get<any>(`${this.pyramidsUrl}/${pyramid.id}/timeSlices`, httpOptions).pipe(map(
        (result: any) => {
          result.pyramidTimeSlices = result._embedded.pyramidTimeSlices;
          return result;
        }));
    }
    return throwError('The pyramid has no time slices.');
  }

  getPyramidFromBaseUrl(dziUrl) {
    const splits = dziUrl.split('/');
    const lastSplit = splits[splits.length - 1];
    const pyramidId = lastSplit.indexOf('.dzi') === lastSplit.length - 4 ?
      splits[splits.length - 2] : lastSplit;
    return this.getById(pyramidId);
  }

}
