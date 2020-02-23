import {Component, Injector, ViewChild} from '@angular/core';
import {StringWidget} from 'ngx-schema-form';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../../workflow.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {dataMap} from '../../../data-service';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent extends StringWidget {
  @ViewChild('instance') instance: NgbTypeahead;

  public data: Array<any>;
  public service: any;

  constructor(
    private workflowService: WorkflowService,
    private injector: Injector
  ) {
    super();
  }

  filter(term) {
    if (this.schema === null || this.schema.format === null) {
      return [];
    }

    const injectable = dataMap.get(this.schema.format);
    this.service = this.injector.get(injectable);
    return this.service.getByNameContainingIgnoreCase(null, term).pipe(map(result => {
      let collections = this.schema.getOutputs();
      collections = collections.concat(result['data']);
      return collections;
    }));
  }

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term => this.filter(term))
  );

  formatter = (x: {name: string}) => x.name;
}
