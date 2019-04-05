import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {WorkflowService} from '../workflow.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {Workflow} from '../workflow';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {WorkflowNewComponent} from '../workflow-new/workflow-new.component';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'creationDate', 'startTime', 'endTime'];
  workflows: Workflow[] = [];

  resultsLength = 0;
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private workflowService: WorkflowService
  ) { }

  ngOnInit() {
    this.getWorkflows();
  }

  getWorkflows(): void {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        const params = {
          pageIndex: this.paginator.pageIndex,
          size: this.pageSize
        };
        return this.workflowService.getWorkflows(params);
      }),
      map(data => {
        this.resultsLength = data.page.totalElements;
        return data.workflows;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => this.workflows = data);
  }

  createNew() {
    const modalRef = this.modalService.open(WorkflowNewComponent);
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.workflowService.createWorkflow(result).subscribe(workflow => {
        const workflowId = workflow ? workflow.id : null;
        this.router.navigate(['workflows/detail', workflowId ]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }

}
