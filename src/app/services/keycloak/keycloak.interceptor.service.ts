import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';
import {Router} from "@angular/router"
import {environment} from '../../../environments/environment';

// This service is responsible for intercepting requests

@Injectable()
export class KeycloakInterceptorService implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If the user is logged in, we add the Bearer token to the request
    if (request.url.startsWith(environment.apiRootUrl) && this.keycloakService.isLoggedIn()) {
      return this.getUserToken().pipe(
        mergeMap((token) => {
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            // if we catch an http error response
            catchError((error: HttpErrorResponse) => {
              // if this error is a 403 error, we navigate to the forbidden-access page
              if (error.status === 403) {
                this.router.navigate(['/403']);
                return throwError(error);
              }
            }));
        }));
    }
    // If the user is not logged in
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          return event;
      }),
      // if we catch an http error response
      catchError((error: HttpErrorResponse) => {
        // if this error is a 401 error, we navigate to the forbidden-access page
        if (error.status === 401) {
          this.router.navigate(['/403']);
          return throwError(error);
        }
      }));
  }

  getUserToken() {
    const tokenPromise: Promise<string> = this.keycloakService.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);
    return tokenObservable;
  }
}
