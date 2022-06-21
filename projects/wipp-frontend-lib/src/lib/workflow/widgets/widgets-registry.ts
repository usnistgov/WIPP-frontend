import {DefaultWidgetRegistry} from 'ngx-schema-form';
import {SearchWidgetComponent} from './search-widget/search-widget.component';
import { Injectable } from "@angular/core";

@Injectable()
export class WidgetsRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();

    this.register('search', SearchWidgetComponent);
  }
}
