import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { KeycloakService } from 'wipp-frontend-lib';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// We bootstrap the App with KeycloakService, to make sure KeycloakService is initialized
KeycloakService.init(environment.keycloak.url, environment.keycloak.realm, environment.keycloak.clientId)
.then(() => platformBrowserDynamic().bootstrapModule(AppModule))
.catch(err => console.log(err));
