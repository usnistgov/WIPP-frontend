import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../dynamic-content/dynamic.component';

@Component({
  selector: 'app-unknown-dynamic',
   template: '<a>{{defaultText}}</a>'
})
export class UnknownDynamicComponent extends DynamicComponent implements OnInit {

  ngOnInit() {
    console.log('unknown');
  }
}
