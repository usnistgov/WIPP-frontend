import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forbidden-access',
  templateUrl: './forbidden-access.component.html',
  styleUrls: ['./forbidden-access.component.css']
})
export class ForbiddenAccessComponent implements OnInit {
  path: String;
  private sub: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.path = params['path'];
    });
  }

}
