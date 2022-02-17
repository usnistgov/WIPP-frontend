import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {

  @Output() dismiss = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  
  public dismissClicked() {
  }
  public closeClicked() {
  }

  constructor() { }

  ngOnInit(): void {
  }

}
