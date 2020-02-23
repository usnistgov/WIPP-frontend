import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {WorkflowService} from '../workflow.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {Workflow} from '../workflow';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {WorkflowNewComponent} from '../workflow-new/workflow-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'creationDate', 'endTime'];
  // displayedColumns: string[] = ['name', 'status', 'creationDate', 'startTime', 'endTime'];
  workflows: Observable<Workflow[]>;
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{ index: number, size: number, sort: string, filter: string }>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private workflowService: WorkflowService,
    private keycloakService: KeycloakService
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
    console.log('sorting');
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
    this.getWorkflows();
  }

  getWorkflows(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.workflows = paramsObservable.pipe(
      switchMap((page) => {
        console.log(page);
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.workflowService.getWorkflowsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((data) => {
              this.resultsLength = data.page.totalElements;
              return data.workflows;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.workflowService.getWorkflows(params).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.workflows;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  createNew() {
    const modalRef = this.modalService.open(WorkflowNewComponent);
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.workflowService.createWorkflow(result).subscribe(workflow => {
        const workflowId = workflow ? workflow.id : null;
        this.router.navigate(['workflows/detail', workflowId]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }
}
