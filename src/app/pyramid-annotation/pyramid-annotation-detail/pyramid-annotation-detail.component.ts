import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {PyramidAnnotation} from '../pyramid-annotation';
import {PyramidAnnotationService} from '../pyramid-annotation.service';
import {TimeSlice} from '../timeSlice';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {saveAs} from 'file-saver';

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
  pyramidAnnotationId = this.route.snapshot.paramMap.get('id');

  @ViewChild('timeSlicesPaginator') timeSlicesPaginator: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private pyramidAnnotationService: PyramidAnnotationService,
    private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    console.log(this.pyramidAnnotationId);
    this.pyramidAnnotationService.getById(this.pyramidAnnotationId)
      .subscribe(pyramidAnnotation => {
        this.pyramidAnnotation = pyramidAnnotation;
      });
    this.getTimeSlices();
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
          return this.pyramidAnnotationService.getTimeSlices(this.pyramidAnnotationId, params);
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
      const blob = new Blob([JSON.stringify(annotation)], {type: 'tex/plain'});
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
