import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Notebook} from '../notebook';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotebookService} from '../notebook.service';

@Component({
  selector: 'app-notebook-detail',
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.css']
})

export class NotebookDetailComponent implements OnInit {
  notebook: Notebook = new Notebook();
  notebookId = this.route.snapshot.paramMap.get('id');

  @ViewChild('notebookDisplay') notebookDisplay: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notebookService: NotebookService
  ) {
  }

  ngOnInit() {
    this.notebookService.getNotebook(this.notebookId)
      .subscribe(notebook => {
        this.notebook = notebook;
      });
    this.displayNotebook();
  }

  displayNotebook() {
    // const fs;
    // // const nb = require('notebookjs');
    // const ipynb = JSON.parse(fs.readFileSync('/Users/snb24/Documents/project/wipp/github/' +
    //   'sample-notebooks-for-wipp-plugin/python-opencv-io.ipynb'));
    // const notebook = NotebookJS.parse(ipynb);
    // console.log(notebook.render().outerHTML);

//     const notebook = nb.parse(JSON.parse('raw_ipynb_json_string'));
// const rendered = notebook.render();
// document.body.appendChild(rendered);
  }
}
