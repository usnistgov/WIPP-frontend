import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PluginService} from '../plugin.service';
import {MatPaginator, MatSort} from '@angular/material';

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
    });
  }

  public clearAll() {
    this.pluginJSON = null;
    this.browsePlugin.nativeElement.value = '';
    this.linkPlugin.nativeElement.value = '';
    // const browseInput = (<HTMLInputElement>document.getElementById('file'));
    // const urlInput = (<HTMLInputElement>document.getElementById('pluginLink'));
    // if (browseInput) {browseInput.value = null; }
    // if (urlInput) {urlInput.value = null; }
  }

  public isJsonValid(textToTest) {
    try {
      // parse it to json
      const data = JSON.parse(textToTest);
      return [true];
    } catch (ex) {
      // set parse error if it fails
      return  [false, ex];
    }
  }

  //   public onClose() {
  //   this.modalService.dismissAll();
  //   this.pluginJSON = null;
  //   const inputValue = (<HTMLInputElement>document.getElementById('pluginDescriptorText'));
  //   if (inputValue) {inputValue.value = null; }
  // }

}
