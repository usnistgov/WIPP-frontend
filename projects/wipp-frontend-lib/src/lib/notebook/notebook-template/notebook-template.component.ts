import {Component, OnInit} from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {NotebookService} from '../notebook.service';

@Component({
  selector: 'app-notebook-template',
  template:
  ' <a routerLink="/{{notebooksUiPath}}/{{idData}}">{{text}}</a>'
})
export class NotebookTemplateComponent extends DynamicComponent implements OnInit {

  notebooksUiPath: string;

  constructor(private notebookService: NotebookService) {
    super();
  }

  static key = 'notebooktemplatecomponent';

  ngOnInit() {
    this.getNotebooksUiPath();
    this.notebookService.getById(this.idData).subscribe(result => {
      this.text = result.name;
    });
  }

  getNotebooksUiPath() {
    this.notebooksUiPath = this.notebookService.getNotebooksUiPath();
  }
}
