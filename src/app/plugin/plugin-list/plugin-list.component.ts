import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Plugin} from '../plugin';
import {PluginService} from '../plugin.service';
import {MatPaginator, MatSort} from '@angular/material';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {BehaviorSubject, from, Observable, of as observableOf} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Route, Router} from '@angular/router';


@Component({
  selector: 'app-plugin-list',
  templateUrl: './plugin-list.template.html',
    styleUrls: ['./plugin-list.component.css']
})
export class PluginListComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'version', 'description'];
  plugins: Observable<Plugin[]>;
  pluginJSON;
  selection = new SelectionModel<Plugin>(false, []);

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private pluginService: PluginService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex, size: page.pageSize,
      sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue
    });
  }

  ngOnInit() {
    this.getPlugins();
  }

  getPlugins(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.plugins = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.pluginService.getPluginsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.plugins;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.pluginService.getPlugins(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.plugins;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  public open(content) {
    this.modalService.open(content, {'size': 'lg'}).result.then((result) => {
      const jsonState = this.isJsonValid(result);
      if (jsonState[0] ) {
        this.pluginService.postPlugin(result).subscribe(
          plugin => this.getPlugins()
        );
        this.pluginJSON = null;
      } else {
        alert('invalid JSON - ' + jsonState[1] ); }
    }, (result) => {
    });
  }

  public onClose() {
    this.modalService.dismissAll();
    this.pluginJSON = null;
    const inputValue = (<HTMLInputElement>document.getElementById('pluginDescriptorText'));
    if (inputValue) {inputValue.value = null; }
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
    const browseInput = (<HTMLInputElement>document.getElementById('file'));
    const urlInput = (<HTMLInputElement>document.getElementById('pluginLink'));
    if (browseInput) {browseInput.value = null; }
    if (urlInput) {urlInput.value = null; }
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

  public onClick(row) {
    this.router.navigate(['/plugins/' + row.id ], { skipLocationChange: false } );
  }

}
