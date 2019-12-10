import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

declare var Keycloak: any;

@Injectable()
export class KeycloakService {
    static auth: any = {};

    static init(): Promise<any> {
        const keycloakAuth: any = Keycloak({
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId
        });

        KeycloakService.auth.loggedIn = false;

        return new Promise((resolve, reject) => {
            keycloakAuth
                .init({ onLoad: 'login-required' })
                .success(() => {
                    KeycloakService.auth.loggedIn = true;
                    KeycloakService.auth.authz = keycloakAuth;
                    KeycloakService.auth.logoutUrl =
                        keycloakAuth.authServerUrl +
                        '/realms/' +
                        environment.keycloak.realm +
                        '/protocol/openid-connect/logout?redirect_uri=' +
                        document.baseURI;

                    KeycloakService.auth.authz.loadUserProfile().success(resolve());
                    /*.success(data => {
                        this.user = new User();
                        this.user.username = data.username;
                        this.user.firstName = data.firstName;
                        this.user.lastName = data.lastName;
                        this.user.email = data.email;

                        resolve();
                    });*/
                })
                .error(() => {
                    reject();
                });
        });
    }

    hasAnyRole(roles: String[]): boolean {
        for (let i = 0; i < roles.length; i++) {
            if (this.hasRole(roles[i])) {
                return true;
            }
        }

        return false;
    }

    hasRole(role: String): boolean {
        return KeycloakService.auth.authz.hasRealmRole(role);
    }

    hasManageUsersRole(): boolean {
        return KeycloakService.auth.authz.hasResourceRole('manage-users', 'realm-management');
    }

    logout() {
        console.log('*** LOGOUT');
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;

        window.location.href = KeycloakService.auth.logoutUrl;
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

    /*getUser(): User {
        return KeycloakService.user;
    }*/
    isLoggedIn(): boolean {
      return KeycloakService.auth.authz.authenticated;
    }
}
