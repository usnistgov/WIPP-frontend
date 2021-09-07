import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Notebook } from '../notebook';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotebookService } from '../notebook.service';
import 'prismjs';
import * as Prism from 'prismjs';
import * as markedImported from 'marked';
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
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalErrorComponent } from '../../modal-error/modal-error.component';
import { PlatformLocation } from '@angular/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Importing as Marked causes  "Cannot call a namespace ('Marked') Error: Cannot call a namespace ('Marked')"
const marked = markedImported;

@Component({
  selector: 'app-notebook-detail',
  templateUrl: './notebook-detail.component.html',
  styleUrls: ['./notebook-detail.component.css']
})
export class NotebookDetailComponent implements OnInit {
  notebook: Notebook = new Notebook();
  notebookId: Observable<string>;
  notebookJson: string;
  @ViewChild('notebookDisplay') notebookDisplay: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient,
    private notebookService: NotebookService,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private location: PlatformLocation
  ) {
    // closes modal when back button is clicked
    location.onPopState(() => this.modalService.dismissAll());
  }

  ngOnInit() {
    this.spinner.show();
    this.getNotebook().subscribe(notebook => {
      this.notebook = notebook;
      this.getNotebookFile()
        .subscribe(notebookJson => {
          this.notebookJson = notebookJson;
          this.displayNotebook();
        },
          error => {
            this.openErrorModal(error);
          }
        );
    }, error => {
      this.router.navigate(['/404']);
    }
    );
  }

  getNotebook() {
    return this.notebookId.pipe(
      switchMap(id => this.notebookService.getById(id))
    );
  }

  getNotebookFile() {
    return this.notebookId.pipe(
      switchMap(id => this.notebookService.getNotebookFile(id))
    );
  }

  displayNotebook() {
    const notebook = nb.parse(this.notebookJson);
    nb.markdown = function (text) {
      return marked(text);
    };
    this.renderer.appendChild(this.notebookDisplay.nativeElement, notebook.render());
    Prism.highlightAll();
    this.spinner.hide();
  }

  openErrorModal(error: any) {
    this.spinner.hide();
    const modalRef = this.modalService.open(ModalErrorComponent);
    modalRef.componentInstance.title = 'Error while loading the notebook file';
    modalRef.componentInstance.message = error['error']['message'];
  }

}
