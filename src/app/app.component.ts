import {Component, OnInit} from '@angular/core';
import { environment} from '../environments/environment';
import {AppConfigService} from './app-config.service';
import {KeycloakService} from './services/keycloak/keycloak.service';
import {NavigationEnd, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';

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
  onlineHelpLink = 'https://github.com/usnistgov/WIPP/tree/master/user-guide';
  apiDocsLink = environment.apiRootUrl + '/swagger-ui/index.html';
  displayApiDocsLink = !environment.production;

  items: MenuItem[] | undefined;

  currentRouterUrl = '';

  constructor(private appConfigService: AppConfigService, private keycloak: KeycloakService, private router: Router) {
    this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
    this.currentRouterUrl = this.router.url;
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentRouterUrl = this.router.url;
        }
      }
    );
  }

  ngOnInit() {
    this.items = [
      {
        label: 'WIPP',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'Data',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Images collections',
            icon: 'pi pi-images',
            routerLink: '/images-collections'
          },
          {
            label: 'Multidimensional visualizations',
            icon: 'pi pi-sliders-h',
            routerLink: '/pyramid-visualizations'
          },
          {
            label: 'AI models',
            icon: 'pi pi-sparkles',
            routerLink: '/ai-models'
          },
          {
            label: 'Image annotations',
            icon: 'pi pi-pen-to-square',
            routerLink: '/image-annotations'

          },
          {
            label: 'CSV collections',
            icon: 'pi pi-file-excel',
            routerLink: '/csv-collections'
          },
          {
            label: 'Stitching vectors',
            icon: 'pi pi-table',
            routerLink: '/stitching-vectors'
          },
          {
            label: 'Legacy pyramids',
            icon: 'pi pi-image',
            routerLink: '/pyramids'
          },
          {
            label: 'Generic data',
            icon: 'pi pi-file',
            routerLink: '/generic-datas'
          },
          {
            label: 'Notebooks',
            icon: 'pi pi-file',
            routerLink: '/notebooks',
            visible: this.jupyterNotebooksLink == undefined ? false : true
          }
        ]
      },
      {
        label: 'Plugins',
        icon: 'pi pi-box',
        routerLink: '/plugins'
      },
      {
        label: 'Workflows',
        icon: 'pi pi-share-alt',
        routerLink: '/workflows'
      }
    ];
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

