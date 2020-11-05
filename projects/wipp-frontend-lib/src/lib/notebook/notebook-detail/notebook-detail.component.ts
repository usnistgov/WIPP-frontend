import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Notebook} from '../notebook';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotebookService} from '../notebook.service';
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
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {PlatformLocation} from '@angular/common';

// nb variable used to be declared in typing.d.ts
// When building the library, nb variable was not found. We can declare it here for now
declare var nb: any;

// Importing as Marked causes  "Cannot call a namespace ('Marked') Error: Cannot call a namespace ('Marked')"
const marked = markedImported;

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
    private spinner: NgxSpinnerService,
    private location: PlatformLocation
  ) {
    // closes modal when back button is clicked
    location.onPopState(() => this.modalService.dismissAll());
  }

  ngOnInit() {
    this.spinner.show();
    this.notebookService.getById(this.notebookId).subscribe(notebook => {
        this.notebook = notebook;
      },
      error => {
        this.openErrorModal(error);
      }
    );
    this.notebookService.getNotebookFile(this.notebookId)
      .subscribe(notebookJson => {
          this.notebookJson = notebookJson;
          this.displayNotebook();
        },
        error => {
          this.openErrorModal(error);
        }
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
