import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import * as Keycloak from 'keycloak-js';

@Injectable()
export class KeycloakService {
    static auth: any = {};

    static init(): Promise<any> {
        const keycloakAuth: Keycloak.KeycloakInstance = Keycloak({
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId
        });

        KeycloakService.auth.loggedIn = false;
        return new Promise((resolve, reject) => {
            keycloakAuth
                .init({ onLoad: 'check-sso', checkLoginIframe: false })
                .success(() => {
                    KeycloakService.auth.loggedIn = false;
                    KeycloakService.auth.authz = keycloakAuth;
                    KeycloakService.auth.profileUrl =
                    KeycloakService.auth.authz.authServerUrl +
                    '/realms/' +
                    environment.keycloak.realm +
                    '/account';
                    resolve();
                })
                .error(() => {
                    reject();
                });
        });
    }

    constructor() { }

    login(): void {
        KeycloakService.auth.authz.login().success(
          () => {
            KeycloakService.auth.loggedIn = true;
          }
        );
      }

    logout(): void {
      KeycloakService.auth.authz.logout({redirectUri : document.baseURI}).success(() => {
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
      });
    }

    profile() {
        window.location.href = KeycloakService.auth.profileUrl;
    }

    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz
                    .updateToken(90) // refresh token if it will expire in 90 seconds or less
                    .success(() => {
                        resolve(<string>KeycloakService.auth.authz.token);
                    })
                    .error(() => {
                        reject('Failed to refresh token');
                    });
            } else {
                reject('Not logged in');
            }
        });
    }

    getUsername(): string {
        return KeycloakService.auth.authz.tokenParsed.preferred_username;
    }

    isLoggedIn(): boolean {
      return KeycloakService.auth.authz.authenticated;
    }

    getKeycloakAuth() {
        return KeycloakService.auth.authz;
    }
}
