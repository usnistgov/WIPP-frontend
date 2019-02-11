import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Plugin} from '../plugin';
import {PluginService} from '../plugin.service';
import {MatPaginator} from '@angular/material';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {from, of as observableOf} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Route, Router} from '@angular/router';


@Component({
  selector: 'app-plugin-list',
  templateUrl: './plugin-list.template.html'
})
export class PluginListComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'version', 'description'];
  plugins: Plugin[] = [];
  selection = new SelectionModel<Plugin>(false, []);



  resultsLength = 0;
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private pluginService: PluginService,
    private router: Router,
    private route: ActivatedRoute
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


public onClick(row) {
  this.router.navigate(['/plugins/' + row.id ], { skipLocationChange: false } );
}
}
