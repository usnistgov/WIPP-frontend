import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';
import {NmrrApiService} from '../nmrr-api.service';
import {Router} from '@angular/router';
import {MatPaginator, MatSort} from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import {PluginNmrr} from '../pluginsNmrr';


@Component({
  selector: 'app-plugin-new',
  templateUrl: './plugin-new.component.html',
  styleUrls: ['./plugin-new.component.css']
})
export class PluginNewComponent implements OnInit {

  @Input() modalReference: any;

  @ViewChild('browsePlugin') browsePlugin: ElementRef;
  @ViewChild('linkPlugin') linkPlugin: ElementRef;
  @ViewChild('pluginDescriptorText') pluginDescriptorText: ElementRef;
  @ViewChild('more') desc: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [ 'name' , 'download'];
  plugins: MatTableDataSource<any> = new MatTableDataSource([]) ;
  pluginsNmrr: PluginNmrr[];


  displayAlert = false;
  displayAlertNmrr = false;
  alertMessage = '';
  alertType = 'danger';

  pluginJSON;

  resultsLength = 0;
  pageSize = 10;

  search = false;
  pluginName;

  tabs: string[] = ['From Laptop', 'From Registry'];
  selectedTab = this.tabs[0];

  constructor(
    private activeModal: NgbActiveModal,
    private pluginService: PluginService,
    private nmrrApiService: NmrrApiService,
    private router: Router) {
  }

  ngOnInit() {
    this.plugins.paginator = this.paginator;
  }

  onFileSelected(event) {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    const self = this;
    reader.onload = function () {
      self.pluginJSON = reader.result;
    };
  }

  getNmrrPlugins(tab) {
    if (tab === 'From Registry') {
      this.getPluginsFromNmrr();
    }
  }

  getByUrl(url, pluginId?) {
    this.pluginService.getJsonFromURL(url).subscribe(
      data => {
        if (pluginId) {
          const index = this.pluginsNmrr.findIndex(plugin => plugin.id === pluginId);
          this.pluginsNmrr[index].manifest = JSON.stringify(data, undefined, 7);
        } else {
          this.pluginJSON = JSON.stringify(data, undefined, 7);
        }
      },
      err => {
        this.displayAlertMessage('danger',
          'Unable to get JSON from URL (for manifests hosted on Github, please use raw URL)');
      }
    );
  }

  clearAll() {
    this.pluginJSON = null;
    this.browsePlugin.nativeElement.value = '';
    this.linkPlugin.nativeElement.value = '';
  }

  isJsonValid(textToTest) {
    try {
      // parse it to json
      const data = JSON.parse(textToTest);
      return [true];
    } catch (ex) {
      // set parse error if it fails
      return [false, ex];
    }
  }

  postPlugin(pluginText) {
    console.log(pluginText);
    const jsonState = this.isJsonValid(pluginText);
    if (jsonState[0]) {
      this.pluginService.postPlugin(pluginText).subscribe(
        plugin => {
          this.displayAlertMessage('success', 'Success! Redirecting...');
          const pluginId = plugin ? plugin.id : null;
          setTimeout(() => {
            this.router.navigate(['plugins', pluginId]);
          }, 2000);
        },
        err => {
          this.displayAlertMessage('danger', 'Could not register plugin: ' + err.error.message);
        });
    } else {
      this.displayAlertMessage('danger', 'Invalid JSON - ' + jsonState[1]);
    }
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }

  displayAlertMessageNmrr(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlertNmrr = true;
  }

  // get plugins from nmrr
  getPluginsFromNmrr(page?): void {
    const parameters = {
      page: page ? page : null
    };

    this.nmrrApiService.getPluginsFromNmrr(parameters).subscribe(
      data => {
        this.resultsLength = data.count;
        this.pluginsNmrr = data.results;
        this.getPluginsFromData();
      },
      err => {
        this.displayAlertMessageNmrr('danger',
          'Unable to get data from api');
      }
    );
  }


  // if the user try to change the page this method will be executed
  pageChanged(page) {
    this.plugins = new MatTableDataSource([]) ;
    if (this.search === false) {
      this.getPluginsFromNmrr(page.pageIndex + 1);
    } else {
      this.getPluginsByName(this.pluginName, page.pageIndex + 1);
    }
  }


  // get plugins whose the name contains a patern
  getPluginsByName(pluginName, id?) {
    const parameters = {
      page: id ? id : null,
      name: pluginName
    };

    this.nmrrApiService.getPluginsFromNmrrByName(parameters).subscribe(
      data => {
        this.resultsLength = data.count;
        this.pluginsNmrr = data.results;
        this.getPluginsFromData();
      },
      err => {
        this.displayAlertMessageNmrr('danger',
          'Unable to get data from api');
      }
    );
  }


  applyFilterByName(pluginName) {
    if (!pluginName) {
      // if there is at least one character in the search input, we get all the plugins
      this.search = false;
      this.getPluginsFromNmrr();
      this.paginator.firstPage();
    } else {
      // if there is no character in the search input, we get all the plugins
      this.pluginName = pluginName;
      this.search = true;
      this.getPluginsByName(pluginName);
      this.paginator.firstPage();
    }
  }

  getPluginsFromData() {
    for (const pluginNmrr of this.pluginsNmrr) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(pluginNmrr.xml_content, 'text/xml');
      const rootElement = xmlDoc.documentElement;
      const pluginXml = rootElement.getElementsByTagName('role')[0];

      pluginNmrr.title = pluginNmrr.title.substr(0, pluginNmrr.title.indexOf('.xml'));
      const fromUrl = this.hasUrlLink(pluginXml);
      if (!fromUrl) {
        pluginNmrr.manifest = pluginXml.getElementsByTagName('PluginManifestContent')[0].innerHTML;
      } else {
        const urlLink = pluginXml.getElementsByTagName('PluginManifestURL')[0].innerHTML;
        this.getByUrl(urlLink, pluginNmrr.id);
      }
    }
  }

  hasUrlLink(pluginXml) {
    return (pluginXml.getElementsByTagName('PluginManifestURL')[0]);
  }

}
