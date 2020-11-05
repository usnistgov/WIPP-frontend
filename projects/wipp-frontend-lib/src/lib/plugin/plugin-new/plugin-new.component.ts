import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';
import {Router} from '@angular/router';

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

  displayAlert = false;
  alertMessage = '';
  alertType = 'danger';

  pluginJSON;

  constructor(
    private activeModal: NgbActiveModal,
    private pluginService: PluginService,
    private router: Router) {
  }

  ngOnInit() {
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

}
