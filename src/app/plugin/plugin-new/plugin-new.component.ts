import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';

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

  pluginJSON;

  constructor(private activeModal: NgbActiveModal,
              private pluginService: PluginService) {
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    const me = this;
    reader.onload = function () {
      me.pluginJSON = reader.result;
    };
  }

  getByUrl(url) {
    this.pluginService.getJsonFromURL(url).subscribe(data => {
        this.pluginJSON = JSON.stringify(data, undefined, 7);
      },
      error => {
        alert('Unknown URL: ' + url);
      }
    );
  }

  public clearAll() {
    this.pluginJSON = null;
    this.browsePlugin.nativeElement.value = '';
    this.linkPlugin.nativeElement.value = '';
  }

  public isJsonValid(textToTest) {
    try {
      // parse it to json
      const data = JSON.parse(textToTest);
      return [true];
    } catch (ex) {
      // set parse error if it fails
      return [false, ex];
    }
  }

  public postPlugin(pluginText) {
    const jsonState = this.isJsonValid(pluginText);
    if (jsonState[0]) {
      this.pluginService.postPlugin(pluginText).subscribe(res => {
      });
      this.pluginJSON = null;
      this.modalReference.close('Cross click');
    } else {
      alert('invalid JSON - ' + jsonState[1]);
    }
  }

}
