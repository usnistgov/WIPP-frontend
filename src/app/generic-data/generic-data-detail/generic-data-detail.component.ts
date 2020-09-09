import { Component, OnInit } from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfigService} from '../../app-config.service';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {GenericData} from '../generic-data';
import {GenericDataService} from '../generic-data.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-generic-data-detail',
  templateUrl: './generic-data-detail.component.html',
  styleUrls: ['./generic-data-detail.component.css']
})
export class GenericDataDetailComponent implements OnInit {

  genericData: GenericData = new GenericData();
  job: Job = null;
  genericDataId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private appConfigService: AppConfigService,
    private genericDataService: GenericDataService,
    private keycloakService: KeycloakService ) {
  }

  ngOnInit() {
    this.genericDataService.getById(this.genericDataId)
      .subscribe(genericData => {
        this.genericData = genericData;
      });
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, {'size': 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

  canEdit(): boolean {
    return(this.keycloakService.isLoggedIn() && this.genericData.owner === this.keycloakService.getUsername());
  }

  makeDataPublic(): void {
    this.genericDataService.makeDataPublic(
      this.genericData).subscribe(genericData => {
      this.genericData = genericData;
    });
  }

  openDownload(url: string) {
    this.genericDataService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

}
