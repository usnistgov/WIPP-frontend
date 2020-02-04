import { Component, OnInit } from '@angular/core';
import { environment} from '../environments/environment';
import {AppConfigService} from './app-config.service';
import {KeycloakService} from './services/keycloak/keycloak.service';
import { KeycloakInstance } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WIPP';
  version = environment.version;
  isNavbarCollapsed = true;
  jupyterNotebooksLink = '';
  plotsUiLink = '';
  public isLoggedIn : boolean;
  public username : string;
  public keycloakAuth: KeycloakInstance;

  constructor(private appConfigService: AppConfigService, private keycloak: KeycloakService) {
    this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
    this.plotsUiLink = this.appConfigService.getConfig().plotsUiUrl;
  }

  ngOnInit() {
    this.keycloakAuth = this.keycloak.getKeycloakAuth();
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

