import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Plugin} from '../plugin';
import {PluginService} from '../plugin.service';
import {MatPaginator} from '@angular/material';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';


@Component({
  selector: 'app-plugin-list',
  templateUrl: './plugin-list.template.html'
})
export class PluginListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'version', 'description'];
  plugins: Plugin[] = [];

  resultsLength = 0;
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private pluginService: PluginService
  ) { }

  ngOnInit() {
    this.getPlugins();
  }

  getPlugins(): void {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        const params = {
          pageIndex: this.paginator.pageIndex,
          size: this.pageSize
        };
        return this.pluginService.getPlugins(params);
      }),
      map(data => {
        this.resultsLength = data.page.totalElements;
        return data.plugins;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => this.plugins = data);
  }

  public open(content) {
    this.modalService.open(content, {'size': 'lg'}).result.then((result) => {
      this.pluginService.postPlugin(result).subscribe(
        plugin => this.getPlugins()
      );
    }, (result) => {
    });
  }
}
