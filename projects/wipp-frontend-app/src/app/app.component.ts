import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wipp-frontend-app';
  version = environment.version;
  isNavbarCollapsed = true;
  jupyterNotebooksLink = '';
  onlineHelpLink = 'https://github.com/usnistgov/WIPP/tree/master/user-guide';
  apiDocsLink = environment.apiRootUrl + '/swagger-ui/index.html';
  displayApiDocsLink = !environment.production;

  constructor(private appConfigService: AppConfigService) {
    //this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
  }
  
}
