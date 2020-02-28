import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';
import {NmrrApiService} from '../nmrr-api.service';
import {Router} from '@angular/router';
import {Plugin} from '../plugin';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator, MatSort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';


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


  //public plugins: MatTableDataSource< Plugin[] >;
  displayedColumns: string[] = [ 'name' , 'download'];
  plugins: MatTableDataSource<any> = new MatTableDataSource([]) ;


  displayAlert = false;
  displayAlertNmrr=false;
  alertMessage = '';
  alertType = 'danger';

  pluginJSON;

  resultsLength = 0;
  pageSize = 10;

  search = false;
  pluginName;

  coinwallet: string[] = ['From repository','Custom'];
  selectedwallet = this.coinwallet[0];

  constructor(
    private activeModal: NgbActiveModal,
    private pluginService: PluginService,
    private NmrrApiService: NmrrApiService,
    private router: Router) {
  }

  ngOnInit() {
    this.plugins.paginator = this.paginator;
    this.getPluginsFromNmrr();

  }

  onFileSelected(event) {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    const self = this;
    reader.onload = function () {
      self.pluginJSON = reader.result;
    };
  }

  getByUrl(url) {
    this.pluginService.getJsonFromURL(url).subscribe(
      data => {
        this.pluginJSON = JSON.stringify(data, undefined, 7);
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
    //console.log(pluginText);
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

/*
  getPluginsFromApi(id?) :void {
    const parametres = {
          page: id ? id : null
    };

    this.NmrrApiService.getApiSoftwares(parametres).subscribe(
      data => {
        this.resultsLength = data.count;
        for (var val of data.results) {
              const params = {
                    id: val.id
              };
              //console.log(val);
               this.NmrrApiService.getSoftwareDetail(params).subscribe(
                data2 => {
                     const data = this.plugins.data;
                     data.push(this.NmrrApiService.getInfoFromdata(data2));
                     this.plugins.data = data;
                     //this.plugins.filteredData.push(this.NmrrApiService.getInfoFromdata(data2));
                     //console.log(data2);
                },
                err2 => {
                  this.displayAlertMessage('danger',
                    'Unable to get data from api');
                  }

              );
        }
      },
      err => {
        this.displayAlertMessage('danger',
          'Unable to get data from api');
      }
    );
  }
*/

  // get plugins from nmrr
  getPluginsFromNmrr(page?) :void {
    const parametres = {
          page: page ? page : null
    };

    this.NmrrApiService.getPluginsFromNmrr(parametres).subscribe(
      data => {
        this.resultsLength = data.count;
        this.plugins.data = this.NmrrApiService.getPluginsFromdata(data.results)
      },
      err => {
        this.displayAlertMessageNmrr('danger',
          'Unable to get data from api');
      }
    );
  }


  // if the user try to chage the page this methode wwill be executed
  pageChanged(page) {
    this.plugins = new MatTableDataSource([]) ;
    if(this.search == false){
      this.getPluginsFromNmrr(page.pageIndex+1);
    }
    else{
      this.getPluginsByName(this.pluginName,page.pageIndex+1);
    }
  }


  // get plugins whose the name contains a patern
   getPluginsByName(pluginName,id?){
         const parametres = {
               page: id ? id : null,
               name:pluginName
         };

         this.NmrrApiService.getPluginsFromNmrrByName(parametres).subscribe(
           data => {
             console.log("count :"+data.count);

             this.resultsLength = data.count;
             this.plugins.data = this.NmrrApiService.getPluginsFromdata(data.results)
           },
           err => {
             this.displayAlertMessageNmrr('danger',
               'Unable to get data from api');
           }
         );
   }


   applyFilterByName(pluginName){
     if (!pluginName) {
         // if there is at least one caracter in the search input, we get all the plugins
       this.search = false;
       this.getPluginsFromNmrr();
       this.paginator.firstPage();
     }
     else{
      // if there is no character in the search imput, we get all the plugins
       this.pluginName = pluginName;
       this.search = true;
       this.getPluginsByName(pluginName);
       this.paginator.firstPage();
     }
   }

   // add the plugin to the wipp database
   postNmrrPlugins(row) {
     var pluginText = row.jsondata;
     console.log(row);
     console.log(row.jsondata);

     const jsonState = this.isJsonValid(pluginText);
     if (jsonState[0]) {
       this.pluginService.postPlugin(pluginText).subscribe(
         plugin => {
           this.displayAlertMessageNmrr('success', 'Success! Redirecting...');
           const pluginId = plugin ? plugin.id : null;
           setTimeout(() => {
             this.router.navigate(['plugins', pluginId]);
           }, 2000);
         },
         err => {
           this.displayAlertMessageNmrr('danger', 'Could not register plugin: ' + err.error.message);
         });
     } else {
       this.displayAlertMessageNmrr('danger', 'Invalid JSON - ' + jsonState[1]);
     }
   }

}
