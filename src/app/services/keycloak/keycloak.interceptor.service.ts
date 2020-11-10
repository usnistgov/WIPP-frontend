import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';

// This service is responsible for intercepting requests

@Injectable()
export class KeycloakInterceptorService implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If the user is logged in, we add the Bearer token to the request
    if (this.keycloakService.isLoggedIn()) {
      return this.getUserToken().pipe(
        mergeMap((token) => {
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next.handle(request);
        }));
    }
    return next.handle(request);
  }

  getUserToken() {
    const tokenPromise: Promise<string> = this.keycloakService.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);
    return tokenObservable;
  }
}
