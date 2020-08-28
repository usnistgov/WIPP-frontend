import { Component } from '@angular/core';
import { environment} from '../environments/environment';
import {AppConfigService} from './app-config.service';
import {KeycloakService} from './services/keycloak/keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WIPP';
  version = environment.version;
  isNavbarCollapsed = true;
  jupyterNotebooksLink = '';
  onlineHelpLink = 'https://github.com/usnistgov/WIPP/tree/master/user-guide';
  apiDocsLink = environment.apiRootUrl + '/swagger-ui/index.html';
  displayApiDocsLink = !environment.production;

  constructor(private appConfigService: AppConfigService, private keycloak: KeycloakService) {
    this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
  }

  isLoggedIn() {
    return this.keycloak.isLoggedIn();
  }
  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  displayUserInfo() {
    return this.keycloak.getUsername();
  }

  profile() {
    this.keycloak.profile();
  }
}

