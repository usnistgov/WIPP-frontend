import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import {ImagesCollection, PaginatedImagesCollections} from './images-collection';
import {map} from 'rxjs/operators';
import {Image, PaginatedImages} from './image';
import {MetadataFile, PaginatedMetadataFiles} from './metadata-file';
import {environment} from '../../environments/environment';
import {Job} from '../job/job';
import {PaginatedTags, Tag} from './tag';

@Injectable({
  providedIn: 'root'
})
export class ImagesCollectionService {

  private imagesCollectionsUrl = environment.apiRootUrl + '/imagesCollections';
  private tagsUrl = environment.apiRootUrl + '/tags';

  constructor(
    private http: HttpClient
  ) {
  }

  getImagesCollections(params): Observable<PaginatedImagesCollections> {
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
    return this.http.get<any>(this.imagesCollectionsUrl, httpOptions).pipe(
      map((result: any) => {
        result.imagesCollections = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollectionsByNameContainingIgnoreCase(params, name): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
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
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.imagesCollections = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollectionsByNameContainingIgnoreCaseAndNumberOfImages(params, name, nbOfImgs): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name).set('numberOfImages', nbOfImgs);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCaseAndNumberOfImages', httpOptions).pipe(
      map((result: any) => {
        result.imagesCollections = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollectionsByTagsContainingIgnoreCase(params, name): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('tagName', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByTags_TagNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.imagesCollections = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollection(id: string): Observable<ImagesCollection> {
    return this.http.get<ImagesCollection>(`${this.imagesCollectionsUrl}/${id}`);
  }

  setImagesCollectionName(imagesCollection: ImagesCollection, name: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {name: name}, httpOptions);
  }

  setImagesCollectionNotes(imagesCollection: ImagesCollection, notes: string): Observable<ImagesCollection> {
      const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
      return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {notes: notes}, httpOptions);
  }

  getImages(imagesCollection: ImagesCollection, params): Observable<PaginatedImages> {
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
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`, httpOptions).pipe(
      map((result: any) => {
        console.log(result); // <--it's an object
        result.images = result._embedded.images;
        return result;
      }));
  }

  getMetadataFiles(imagesCollection: ImagesCollection, params): Observable<PaginatedMetadataFiles> {
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
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`, httpOptions).pipe(
      map((result: any) => {
        console.log(result); // <--it's an object
        result.metadataFiles = result._embedded.metadataFiles;
        return result;
      }));
  }

  getTags(): Observable<Tag> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    // 1000 is the maximum number of results
    const httpParams = new HttpParams().set('page', '0').set('size', String(1000)).set('sort', null);
    httpOptions.params = httpParams;
    return this.http.get<Tag[]>(`${this.tagsUrl}`, httpOptions).pipe(map((allTags: any ) => {
      allTags.tags = allTags._embedded.tags; return allTags; }));
  }

  createImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    return this.http.post<ImagesCollection>(this.imagesCollectionsUrl, imagesCollection);
  }

  deleteImagesCollection(imagesCollection: ImagesCollection) {
    return this.http.delete<ImagesCollection>(imagesCollection._links.self.href);
  }

  deleteImage(image: Image) {
    return this.http.delete<Image>(image._links.self.href);
  }

  deleteAllImages(imagesCollection: ImagesCollection) {
    if (imagesCollection.numberOfImages > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`);
    }
  }

  deleteMetadataFile(metadata: MetadataFile) {
    return this.http.delete<Image>(metadata._links.self.href);
  }

  deleteAllMetadataFiles(imagesCollection: ImagesCollection) {
    if (imagesCollection.numberOfMetadataFiles > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`);
    }
  }

  createTag(tag: Tag) {
    return this.http.post<Tag>(`${this.tagsUrl}`, tag);
  }

  addTag(tagList: Tag[], imagesCollection: ImagesCollection, allTags: Tag[]) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    const tagToAdd = '{"tags": [';
    const end = '] }';
    const list = [];
    for (const tag of tagList) {

      if (!allTags.some(e => e.tagName === tag.tagName) ) {
      this.createTag(tag).subscribe();
      }
    list.push('{"tagName": "' + tag.tagName + '"}' );
    }
    return this.http.patch<Tag>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, tagToAdd + list + end, httpOptions);
  }

  lockImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {locked: true}, httpOptions);
  }

  getImagesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/images`;
  }

  getMetadataFilesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`;
  }

  getSourceJob(imagesCollection: ImagesCollection): Observable<Job> {
    if (imagesCollection._links['sourceJob']) {
      return this.http.get<Job>(imagesCollection._links['sourceJob']['href']);
    }
    return observableOf(null);
  }
}
