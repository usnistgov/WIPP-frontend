import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Notebook} from '../notebook';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotebookService} from '../notebook.service';
import 'prismjs';
import * as Prism from 'prismjs';
import * as Marked from 'marked';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';

@Component({
  selector: 'app-notebook-detail',
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.css']
})
export class NotebookDetailComponent implements OnInit {
  notebook: Notebook = new Notebook();
  notebookId = this.route.snapshot.paramMap.get('id');
  notebookJson: string;
  @ViewChild('notebookDisplay') notebookDisplay: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private notebookService: NotebookService,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
  ) {
  }
  ngOnInit() {
    this.spinner.show();
    this.notebookService.getNotebook(this.notebookId).subscribe(notebook => {
      this.notebook = notebook;
    },
        error1 => {this.spinner.hide();
     const modalRef = this.modalService.open(ModalErrorComponent);
          modalRef.componentInstance.title = 'Error while loading the notebook';
          modalRef.componentInstance.message = error1.error.message; }
        );
    this.notebookService.getNotebookFile(this.notebookId)
      .subscribe(notebookJson => {
          this.notebookJson = notebookJson;
          this.displayNotebook();
        },
          error1 => {this.spinner.hide();
       const modalRef = this.modalService.open(ModalErrorComponent);
          modalRef.componentInstance.title = 'Error while loading the notebook file';
          modalRef.componentInstance.message = error1.error.message; }
      );
  }
  displayNotebook() {
      const notebook = nb.parse(this.notebookJson);
      nb.markdown = function (text) {
        return Marked(text);
      };
      this.renderer.appendChild(this.notebookDisplay.nativeElement, notebook.render());
      Prism.highlightAll();
      this.spinner.hide();
    }
}
