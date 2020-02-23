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
  plotsUiLink = '';

  constructor(private appConfigService: AppConfigService, private keycloak: KeycloakService) {
    this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
    this.plotsUiLink = this.appConfigService.getConfig().plotsUiUrl;
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

