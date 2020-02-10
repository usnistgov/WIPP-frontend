import { Component } from '@angular/core';
import { environment} from '../environments/environment';
import {AppConfigService} from './app-config.service';

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
  onlineHelpLink = 'https://github.com/usnistgov/WIPP/tree/master/user-guide';
  apiDocsLink = environment.apiRootUrl + '/swagger-ui.html';

  constructor(private appConfigService: AppConfigService) {
    this.jupyterNotebooksLink = this.appConfigService.getConfig().jupyterNotebooksUrl;
    this.plotsUiLink = this.appConfigService.getConfig().plotsUiUrl;
  }
}

