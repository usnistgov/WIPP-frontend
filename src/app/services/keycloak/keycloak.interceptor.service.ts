import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';
import {Router} from "@angular/router"


@Injectable()
export class KeycloakInterceptorService implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
              if (error.status == 403){
                this.router.navigate(['/403', error.url]);
                return throwError(error);
              }
            }));
        }));
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403){
          this.router.navigate(['/403', error.url]);
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