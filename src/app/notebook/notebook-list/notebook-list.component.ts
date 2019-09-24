import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Notebook} from '../notebook';
import {NotebookService} from '../notebook.service';
import {HttpClient} from '@angular/common/http';

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


@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.css']
})
export class NotebookListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'creationDate'];
  notebooks: Observable<Notebook[]>;
  target;
  @ViewChild('id3') id3: ElementRef;
  html;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{ index: number, size: number, sort: string, filter: string }>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('target') target: ElementRef;

  json = '{\n' +
    ' "cells": [\n' +
    '  {\n' +
    '   "cell_type": "markdown",\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "source": [\n' +
    '    "# Sample Jupyter Notebook for WIPP Workflow"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "markdown",\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "source": [\n' +
    '    "## Install Python libraries not pre-installed in Polus Notebooks"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "!pip install -q opencv-python"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "markdown",\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "source": [\n' +
    '    "## Read image collections from WIPP"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "# # UNCOMMENT THIS CODE IF RUNNING INTERACTIVELY\\n",\n' +
    '    "# import requests\\n",\n' +
    '    "# api_route = \'http://wipp-backend:8080/api/\'\\n",\n' +
    '    "# collections_path = \'/opt/shared/wipp/collections/\'\\n",\n' +
    '    "\\n",\n' +
    '    "# def get_collection_path(collection_name):\\n",\n' +
    '    "#     r = requests.get(api_route + \'imagesCollections/search/findByNameContainingIgnoreCase?name=\' + collection_name)\\n",\n' +
    '    "#     if r.status_code==200:\\n",\n' +
    '    "#         collection_id = r.json()[\'_embedded\'][\'imagesCollections\'][0][\'id\']\\n",\n' +
    '    "#     collection_path = collections_path + collection_id + \'/images/\'\\n",\n' +
    '    "#     return collection_path\\n",\n' +
    '    "\\n",\n' +
    '    "# input_path = get_collection_path(\'test-data-pyr\')\\n",\n' +
    '    "# output_path = \'/home/jovyan/output\'"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "markdown",\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "source": [\n' +
    '    "For running as a WIPP Workflow, please set the tags for cell below. Select the cell below and click **Notebook Tools** on the left panel ![Alt text](build.svg). Navigate to **Advanced Tools** -> **Cell Metadata**, then add the following entry:\\n",\n' +
    '    "```\\n",\n' +
    '    "\\"tags\\": [ \\"parameters\\" ]\\n",\n' +
    '    "```\\n",\n' +
    '    "Then all variables in this cell will become input parameters for WIPP. Here we only need paths to input and output image collections"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "Python3",\n' +
    '    "tags": [\n' +
    '     "parameters"\n' +
    '    ]\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "# KEEP THIS CODE UNCOMMENTED WHEN RUNNING AS WIPP WORKFLOW TO SUPPLY IMAGE COLLECTION NAMES\\n",\n' +
    '    "input_path = \'\'\\n",\n' +
    '    "output_path = \'\'"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "markdown",\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "source": [\n' +
    '    "## Example code\\n",\n' +
    '    "\\n",\n' +
    '    "In this example we are reading the images from input image collection and write them to output image collection"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "Python3"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "import cv2\\n",\n' +
    '    "import os,glob\\n",\n' +
    '    "import numpy as np"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "Python3"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "#Read all the files(.tif) in the directory using cv2\\n",\n' +
    '    "filenames = glob.glob(os.path.join(input_path, \'*.tif\'))\\n",\n' +
    '    "images = [cv2.imread(img, cv2.IMREAD_COLOR) for img in filenames]"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "Python3"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "# Example of saving images to output image collection\\n",\n' +
    '    "for index,img_file in enumerate(images):\\n",\n' +
    '    "    title =  os.path.basename(filenames[index])\\n",\n' +
    '    "    img = cv2.cvtColor(img_file, cv2.COLOR_BGR2GRAY)\\n",\n' +
    '    "    cv2.imwrite(output_path + f\\"/Output_image_{title}\\", img)"\n' +
    '   ]\n' +
    '  },\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": null,\n' +
    '   "metadata": {\n' +
    '    "Collapsed": "false",\n' +
    '    "kernel": "SoS"\n' +
    '   },\n' +
    '   "outputs": [],\n' +
    '   "source": [\n' +
    '    "# # Example of saving data to output image collection\\n",\n' +
    '    "# with open(output_path + \'/stats.dat\', \'w\') as f:\\n",\n' +
    '    "#     for image in images:\\n",\n' +
    '    "#         f.write(f\\"{image.shape}\\\\n\\")"\n' +
    '   ]\n' +
    '  }\n' +
    ' ],\n' +
    ' "metadata": {\n' +
    '  "kernelspec": {\n' +
    '   "display_name": "Python 3",\n' +
    '   "language": "python",\n' +
    '   "name": "python3"\n' +
    '  },\n' +
    '  "language_info": {\n' +
    '   "codemirror_mode": {\n' +
    '    "name": "ipython",\n' +
    '    "version": 3\n' +
    '   },\n' +
    '   "file_extension": ".py",\n' +
    '   "mimetype": "text/x-python",\n' +
    '   "name": "python",\n' +
    '   "nbconvert_exporter": "python",\n' +
    '   "pygments_lexer": "ipython3",\n' +
    '   "version": "3.7.3"\n' +
    '  }\n' +
    ' },\n' +
    ' "nbformat": 4,\n' +
    ' "nbformat_minor": 4\n' +
    '}\n';

  json2 = '{\n' +
    ' "cells": [\n' +
    '  {\n' +
    '   "cell_type": "code",\n' +
    '   "execution_count": 2,\n' +
    '   "metadata": {},\n' +
    '   "outputs": [\n' +
    '    {\n' +
    '     "data": {\n' +
    '      "image/png": "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\\n",\n' +
    '      "text/plain": [\n' +
    '       "<Figure size 432x288 with 1 Axes>"\n' +
    '      ]\n' +
    '     },\n' +
    '     "metadata": {\n' +
    '      "needs_background": "light"\n' +
    '     },\n' +
    '     "output_type": "display_data"\n' +
    '    }\n' +
    '   ],\n' +
    '   "source": [\n' +
    '    "import matplotlib.pyplot as plt\\n",\n' +
    '    "plt.plot([1, 2, 3, 4])\\n",\n' +
    '    "plt.ylabel(\'some numbers\')\\n",\n' +
    '    "plt.show()"\n' +
    '   ]\n' +
    '  }\n' +
    ' ],\n' +
    ' "metadata": {\n' +
    '  "kernelspec": {\n' +
    '   "display_name": "Python 3",\n' +
    '   "language": "python",\n' +
    '   "name": "python3"\n' +
    '  },\n' +
    '  "language_info": {\n' +
    '   "codemirror_mode": {\n' +
    '    "name": "ipython",\n' +
    '    "version": 3\n' +
    '   },\n' +
    '   "file_extension": ".py",\n' +
    '   "mimetype": "text/x-python",\n' +
    '   "name": "python",\n' +
    '   "nbconvert_exporter": "python",\n' +
    '   "pygments_lexer": "ipython3",\n' +
    '   "version": "3.7.3"\n' +
    '  }\n' +
    ' },\n' +
    ' "nbformat": 4,\n' +
    ' "nbformat_minor": 4\n' +
    '}\n';


  constructor(
    private notebookService: NotebookService,
    private http: HttpClient) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

  ngOnInit() {


  }

  ngAfterViewInit(): void {
        const notebook = nb.parse((JSON.parse(this.json)));
    nb.markdown = function (text) {
      return Marked(text);
    }

    // const rendered = notebook.render();
    document.getElementById('id3').appendChild(notebook.render());
    Prism.highlightAll();
    // this.id3. = rendered;
  }



  // public getJSON(): Observable<any> {
  //   return this.http.get(this._jsonURL);
  // }

  // sortChanged(sort) {
  //   // If the user changes the sort order, reset back to the first page.
  //   this.paramsChange.next({
  //     index: 0, size: this.paramsChange.value.size,
  //     sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter
  //   });
  // }
  //
  // pageChanged(page) {
  //   this.paramsChange.next({
  //     index: page.pageIndex, size: page.pageSize,
  //     sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter
  //   });
  // }
  //
  // applyFilterByName(filterValue: string) {
  //   // if the user filters by name, reset back to the first page
  //   this.paramsChange.next({
  //     index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue
  //   });
  // }



    // ngOnInit() {
    // const paramsObservable = this.paramsChange.asObservable();
    // this.notebooks = paramsObservable.pipe(
    //   switchMap((page) => {
    //     const params = {
    //       pageIndex: page.index,
    //       size: page.size,
    //       sort: page.sort
    //     };
    //     if (page.filter) {
    //       return this.notebookService.getNotebooksByNameContainingIgnoreCase(params, page.filter).pipe(
    //         map((data) => {
    //           this.resultsLength = data.page.totalElements;
    //           return data.notebooks;
    //         }),
    //         catchError(() => {
    //           return observableOf([]);
    //         })
    //       );
    //     }
    //     return this.notebookService.getNotebooks(params).pipe(
    //       map((data) => {
    //         this.resultsLength = data.page.totalElements;
    //         return data.notebooks;
    //       }),
    //       catchError(() => {
    //         return observableOf([]);
    //       })
    //     );
    //   })
    // );
  // }

}
