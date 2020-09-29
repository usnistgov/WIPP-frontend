import {DefaultWidgetRegistry} from 'ngx-schema-form';
import {SearchWidgetComponent} from './search-widget/search-widget.component';

export class WidgetsRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();

    this.register('search', SearchWidgetComponent);
  }
}
