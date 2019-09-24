import { Component } from '@angular/core';
import { environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WIPP';
  isNavbarCollapsed = true;
  jupyterNotebooksLink = environment.jupyterNotebooksUrl;
  plotsUiLink = environment.plotsUiUrl;
}

