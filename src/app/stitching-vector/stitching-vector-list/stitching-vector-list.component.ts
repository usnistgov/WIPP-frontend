import {Component, NgModule, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTable, MatTableDataSource, MatTableModule} from '@angular/material';
import {StitchingVector} from '../stitching-vector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StitchingVectorNewComponent} from '../stitching-vector-new/stitching-vector-new.component';
import {StitchingVectorService} from '../stitching-vector.service';

@Component({
  selector: 'app-stitching-vector-list',
  templateUrl: './stitching-vector-list.component.html',
  styleUrls: ['./stitching-vector-list.component.css']
})
@NgModule({
  imports: [MatTableModule, MatTableDataSource, MatTable]
})
export class StitchingVectorListComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Creation date', 'Number of time slices'];
  imagesCollections: StitchingVector[] = [];

  resultsLength = 0;
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private stitchingVectorService: StitchingVectorService,
    private modalService: NgbModal
  ) {
  }


  ngOnInit() {
  }


  createNew() {
    const modalRef = this.modalService.open(StitchingVectorNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

}
