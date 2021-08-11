import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PyramidAnnotation } from '../pyramid-annotation';
import { PyramidAnnotationService } from '../pyramid-annotation.service';
import { TimeSlice } from '../timeSlice';
import { KeycloakService } from '../../services/keycloack/keycloak.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pyramid-annotation-detail',
  templateUrl: './pyramid-annotation-detail.component.html',
  styleUrls: ['./pyramid-annotation-detail.component.css']
})
export class PyramidAnnotationDetailComponent implements OnInit {
  pyramidAnnotation: PyramidAnnotation = new PyramidAnnotation();
  timeSlices: TimeSlice[] = [];
  displayedColumnsTimeSlices: string[] = ['sliceNumber', 'actions'];
  resultsLength = 0;
  pageSize = 20;
  pyramidAnnotationId: Observable<string>;

  @ViewChild('timeSlicesPaginator', { static: true }) timeSlicesPaginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private pyramidAnnotationService: PyramidAnnotationService,
    private keycloakService: KeycloakService) {
    this.pyramidAnnotationId = this.route.params.pipe(
      map(data => data.id)
    );
  }

  ngOnInit() {
    this.getPyramidAnnotation()
      .subscribe(pyramidAnnotation => {
        this.pyramidAnnotation = pyramidAnnotation;
      });
    this.getTimeSlices();
  }

  getPyramidAnnotation() {
    return this.pyramidAnnotationId.pipe(
      switchMap(id => this.pyramidAnnotationService.getById(id))
    );
  }

  getTimeSlices(): void {
    merge(this.timeSlicesPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const params = {
            pageIndex: this.timeSlicesPaginator.pageIndex,
            size: this.pageSize
          };
          return this.pyramidAnnotationId.pipe(
            switchMap(id => this.pyramidAnnotationService.getTimeSlices(id, params))
          );
        }),
        map(paginatedResult => {
          this.resultsLength = paginatedResult.page.totalElements;
          return paginatedResult.data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.timeSlices = data);
  }

  downloadAnnotation(url: string, filename: string): void {
    this.pyramidAnnotationService.downloadAnnotation(url).subscribe(annotation => {
      const blob = new Blob([JSON.stringify(annotation)], { type: 'tex/plain' });
      saveAs(blob, filename);
    });
  }

  makePyramidAnnotationPublic(): void {
    this.pyramidAnnotationService.makePyramidAnnotationPublic(
      this.pyramidAnnotation).subscribe(pyramidAnnotation => {
        this.pyramidAnnotation = pyramidAnnotation;
      });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.pyramidAnnotation);
  }
}
