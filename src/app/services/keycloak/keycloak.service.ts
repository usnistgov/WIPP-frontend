import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import * as Keycloak from 'keycloak-js';

//This class is responsible for the interactions between keycloak-js and the Keycloak instance
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
                // We use check-sso, so login is not mandatory
                .init({ onLoad: 'check-sso', checkLoginIframe: false })
                .success(() => {
                    // We initialize some attributes
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

    // On login, this method is called
    login(): void {
        KeycloakService.auth.authz.login({redirectUri : document.baseURI}).success(
          () => {
              // on success, loggedIn is set to true
            KeycloakService.auth.loggedIn = true;
          }
        );
      }

    logout(): void {
      KeycloakService.auth.authz.logout({redirectUri : document.baseURI}).success(
        () => {
          // on logout, loggedIn is set to false
          KeycloakService.auth.loggedIn = false;
          KeycloakService.auth.authz = null;
      });
    }

    profile() {
        // redirect to the profile page
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

    hasRole(role: string): boolean {
      return KeycloakService.auth.authz.hasRealmRole(role);
    }

    getKeycloakAuth() {
      return KeycloakService.auth.authz;
    }

    canEdit(resource: any): boolean {
      if (this.isLoggedIn()) {
        if (this.hasRole('admin') || (resource.hasOwnProperty('owner') && this.getUsername() === resource['owner'])) {
          return true;
        }
      }
      return false;
    }

    canDeletePublicData(): boolean {
      if (this.isLoggedIn()) {
        if (this.hasRole('admin')) {
          return true;
        }
      }
      return false;
    }
}
