import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {PaginatedPyramid, Pyramid} from './pyramid';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  params: {}
};

@Injectable({
  providedIn: 'root'
})
export class PyramidService {
  private pyramidsUrl = environment.apiRootUrl + '/pyramids';

  constructor(
    private http: HttpClient) {
  }

  getPyramid(id: string): Observable<Pyramid> {
    return this.http.get<Pyramid>(`${this.pyramidsUrl}/${id}`);
  }

  getPyramids(params): Observable<PaginatedPyramid> {
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.pyramidsUrl, httpOptions).pipe(
      map((result: any) => {
        result.pyramids = result._embedded.pyramids;
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
    if (pyramid._links['timeSlices']) {
      return this.http.get<any>(`${this.pyramidsUrl}/${pyramid.id}/timeSlices`, params).pipe(map(
        (result: any) => {
          result.pyramidTimeSlices = result._embedded.pyramidTimeSlices;
          return result;
        }));
    }
    return throwError('The pyramid has no time slices.');
  }

}
