import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { KeycloakService } from './app/services/keycloak/keycloak.service';

if (environment.production) {
  enableProdMode();
}
// We bootstrap the App with KeycloakService, to make sure KeycloakService is initialized
KeycloakService.init()
.then(() => platformBrowserDynamic().bootstrapModule(AppModule))
.catch(err => console.log(err));
