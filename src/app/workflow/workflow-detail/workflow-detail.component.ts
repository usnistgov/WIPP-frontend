import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';

import {catchError, map, switchMap, find} from 'rxjs/operators';
import {BehaviorSubject, Observable, of as observableOf, Subject} from 'rxjs';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { plugins } from 'prismjs';


@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css']
})

export class WorkflowDetailComponent implements OnInit, OnDestroy {

  workflow: Workflow = new Workflow();

  selectedSchema = null;
  pluginList : Observable<any[] | Plugin[]>;
  selection = new SelectionModel<Plugin>(false, []);
  pluginsObervable: Observable<any[] | Plugin[]>;
  displayedColumns: string[] = ['name', 'version', 'description'];
  institutionList = [];
  categoryList = [];
  categorySelected = 'all';
  institutionSelected = 'all';
  nameSearch = null;
  jobOutputs = {
    collections: [],
    stitchingVectors: [],
    tensorflowModels: [],
    csvCollections: [],
    notebooks: []
  };
  jobs: Job[] = [];
  workflowId = this.route.snapshot.paramMap.get('id');

  // ngx-graph settings and properties
  update$: Subject<any> = new Subject();
  nodes = [];
  links = [];
  enableZoom = false;
  layoutSettings = {
    orientation: 'LR'
  };
  orientationOptions = [
    {
      value: 'LR',
      label: 'Left to right'
    },
    {
      value: 'RL',
      label: 'Right to left'
    },
    {
      value: 'TB',
      label: 'Top to bottom'
    },
    {
      value: 'BT',
      label: 'Bottom to top'
    }
  ];

  argoUiBaseUrl = '';
  argoUiLink;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string, category: string, institution: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private pluginService: PluginService,
    private workflowService: WorkflowService,
    private appConfigService: AppConfigService) {
      this.paramsChange = new BehaviorSubject({
        index: 0,
        size: this.pageSize,
        sort: 'creationDate,desc',
        filter: '',
        category: 'all',
        institution: 'all'
      });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter, category: this.paramsChange.value.category, institution: this.paramsChange.value.institution
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex, size: page.pageSize,
      sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter, category: this.paramsChange.value.category, institution: this.paramsChange.value.institution
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue, category: this.paramsChange.value.category, institution: this.paramsChange.value.institution
    });
  }
  //Test
  applyFilterByCategory(filterValue: string) {
    // if the user filters by category, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter, category: filterValue, institution: this.paramsChange.value.institution
    });
  }

  applyFilterByInstituttion(filterValue: string) {
    // if the user filters by institution, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter, category: this.paramsChange.value.category, institution: filterValue
    });
  }

  ngOnInit() {
    this.argoUiBaseUrl = this.appConfigService.getConfig().argoUiBaseUrl;
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
      this.workflow = workflow;
      this.updateArgoUrl();
    });
    
    //Utilisation de plugins search criteria
     this.getPlugins();
      
    //stubCategoryInstitution
    this.stubCategory_Institution();

    this.pluginList.subscribe(
      (plugins) => {
        this.getJobs();
      }
    );
  }

  getPlugins(): void {
    const paramsObservable = this.paramsChange.asObservable();
    this.pluginList = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };

        return this.pluginService.getPluginsByCriteria(params, page.filter, page.category, page.institution).pipe(
          map((data) => {
            this.resultsLength = data.page.totalElements;
            return data.plugins;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
        
      })
    );
    
  }
  
  resetForm() {
    this.pluginList.subscribe(
      (plugins) => {
        this.selectedSchema = plugins[0];
        this.generateSchema(this.selectedSchema);
      },
      (error) => {
        
      }
    );
    
  }
  updateSelectedSchema(plugin) { 
    this.selectedSchema = plugin; 
    this.generateSchema(this.selectedSchema);
  }
  open(content, plugin) {
    if(plugin==='') {
      //First ng-template open
    }
    else {
      //Second ng-template open
      this.selectedSchema = plugin; 
      this.generateSchema(this.selectedSchema);
    }
    
    this.modalService.open(content, {'size': 'lg'}).result.then((result) => {
      const task = {};

      // configure job
      task['name'] = this.workflow.name + '-' + result.taskName;
      task['wippExecutable'] = this.selectedSchema.id;
      task['wippWorkflow'] = this.workflow.id;
      task['type'] = this.selectedSchema.name;
      task['dependencies'] = [];
      task['parameters'] = {};
      task['outputParameters'] = {};
      // add job parameters

      this.selectedSchema.outputs.forEach(output => {
        task['outputParameters'][output.name] = null;
      });

      for (const inputEntry in result.inputs) {
        if (result.inputs.hasOwnProperty(inputEntry)) {
          const type = this.selectedSchema.properties.inputs.properties[inputEntry]['format'];
          let value = result.inputs[inputEntry];
          if (type === 'collection' ||
            type === 'stitchingVector' ||
            type === 'tensorflowModel' ||
            type === 'csvCollection' ||
            type === 'notebook') {
            if (value.hasOwnProperty('virtual') && value.virtual === true && value.hasOwnProperty('sourceJob')) {
              task['dependencies'].push(value.sourceJob);
            }
            value = value.hasOwnProperty('id') ? value.id : null;
          }
          if (type === 'array') {
            value = value.join(',');
          }
          task['parameters'][inputEntry] = value;
        }
      }
      // push job
      this.workflowService.createJob(task).subscribe(job => {
        this.resetForm();
        this.getJobs();
      }, error => {
        this.resetForm();
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Error while creating new task';
        modalRefErr.componentInstance.message = error.error;
      });
    }, (result) => {
      //this.resetForm();
    });

  }

  populateJobOutputs(job) {
    const pluginId = job.wippExecutable;
    this.pluginService.getPlugin(pluginId).subscribe( (result) => {
        const matchingPlugin = result;
        matchingPlugin.outputs.forEach(output => {
          if (output['type'] === 'collection') {
            const outputCollection = {
              id: '{{ ' + job.id + '.' + output['name'] + ' }}',
              name: '{{ ' + job.name + '.' + output['name'] + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.collections.push(outputCollection);
          } else if (output['type'] === 'stitchingVector') {
            const outputStitchingVector = {
              id: '{{ ' + job.id + '.' + output['name'] + ' }}',
              name: '{{ ' + job.name + '.' + output['name'] + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.stitchingVectors.push(outputStitchingVector);
          } else if (output['type'] === 'tensorflowModel') {
            const outputTensorflowModel = {
              id: '{{ ' + job.id + '.' + output['name'] + ' }}',
              name: '{{ ' + job.name + '.' + output['name'] + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.tensorflowModels.push(outputTensorflowModel);
          } else if (output['type'] === 'csvCollection') {
            const outputCsvCollection = {
              id: '{{ ' + job.id + '.' + output['name'] + ' }}',
              name: '{{ ' + job.name + '.' + output['name'] + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.csvCollections.push(outputCsvCollection);
          } else if (output['type'] === 'notebook') {
            const outputNotebook = {
              id: '{{ ' + job.id + '.' + output['name'] + ' }}',
              name: '{{ ' + job.name + '.' + output['name'] + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.notebooks.push(outputNotebook);
          }
        });
      }
    );
    
  }

  submitWorkflow() {
    this.spinner.show();
    this.workflowService.submitWorkflow(this.workflow)
      .subscribe(
        result => {
        },
        error => {
          this.spinner.hide();
          const modalRef = this.modalService.open(ModalErrorComponent);
          modalRef.componentInstance.title = 'Workflow submission failed';
          modalRef.componentInstance.message = error.error;
        }
      ).add(() => {
      this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
        this.workflow = workflow;
        this.updateArgoUrl();
        this.spinner.hide(); // if submission was successful, spinner is still spinning
      });
    });
  }

  generateSchema(plugin) {
      this.selectedSchema.properties = {
        // task name field
        'taskName': {
          'type': 'string',
          'description': 'Task name',
          'format': 'string',
          'widget': 'string',
          'placeholder': 'Enter a name for this task',
          'maxLength': 127 - this.workflow.name.length
        },
        // job inputs fields
        'inputs': {
          'type': 'object',
          'required': [],
          'properties': {}
        }
      };

      try {
        // default field bindings - none
        this.selectedSchema.fieldBindings = {};
        // TODO: validation of plugin ui description
        this.selectedSchema.inputs.forEach(input => {
          const inputSchema = {};
          // common properties
          inputSchema['key'] = 'inputs.' + input.name;
          // inputSchema['description'] = input.description;
          if (input.required) {
            this.selectedSchema.properties.inputs.required.push(input.name);
          }
          // type-specific properties
          switch (input.type) {
            case 'collection':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'collection';
              inputSchema['getOutputCollections'] = () => this.jobOutputs.collections;
              break;
            case 'stitchingVector':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'stitchingVector';
              inputSchema['getOutputStitchingVectors'] = () => this.jobOutputs.stitchingVectors;
              break;
            case 'tensorflowModel':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'tensorflowModel';
              inputSchema['getOutputTensorflowModels'] = () => this.jobOutputs.tensorflowModels;
              break;
            case 'csvCollection':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'csvCollection';
              inputSchema['getOutputCsvCollections'] = () => this.jobOutputs.csvCollections;
              break;
            case 'notebook':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = 'notebook';
              inputSchema['getOutputNotebooks'] = () => this.jobOutputs.notebooks;
              break;
            case 'enum':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'select';
              inputSchema['oneOf'] = [];
              input.options.values.forEach(value => {
                inputSchema['oneOf'].push({
                  'enum': [value],
                  'description': value
                });
              });
              inputSchema['default'] = input.options.values[0];
              break;
            case 'array':
              inputSchema['type'] = 'array';
              inputSchema['format'] = 'array';
              inputSchema['items'] = input.options.items;
              break;
            default:
              inputSchema['type'] = input.type;
          }
          // ui properties
          const ui = this.selectedSchema.ui.find(v => v.key === inputSchema['key']);
          if (ui.hasOwnProperty('title')) {
            inputSchema['title'] = ui.title;
          }
          if (ui.hasOwnProperty('description')) {
            inputSchema['placeholder'] = ui.description;
          }
          if (ui.hasOwnProperty('condition')) {
            inputSchema['condition'] = ui.condition;
            const conditionElements = ui.condition.split('==');
            if (conditionElements.length === 2) {
              const inputName = conditionElements[0].split('.');
              if (inputName.length > 0) {
                inputSchema['visibleIf'] = {};
                inputSchema['visibleIf'][inputName[inputName.length - 1]] = conditionElements[1];
              }
            }
          }
          // hidden fields
          if (ui.hasOwnProperty('hidden') && ui.hidden === true) {
            inputSchema['widget'] = 'hidden';
          }
          // custom bindings - update value of target input from value of source input
          if (ui.hasOwnProperty('bind')) {
            const sourceField = '/inputs/' + ui.bind;
            const targetField = ui['key'].split('.').join('/');
            this.selectedSchema.fieldBindings[sourceField] = [
              {
                'input': (event, formProperty: FormProperty) => {
                  const parent: PropertyGroup = formProperty.findRoot();
                  const target: FormProperty = parent.getProperty(targetField);

                  target.setValue(formProperty.value, false);
                }
              }
            ];
          }
          if (ui.hasOwnProperty('default')) {
            inputSchema['default'] = input.default;
          }
          this.selectedSchema.properties.inputs.properties[input.name] = inputSchema;
        });
        // field sets - arrange fields by groups
        const fieldsetsList = this.selectedSchema.ui.find(v => v.key === 'fieldsets');
        if (fieldsetsList) {
          this.selectedSchema.properties.inputs.fieldsets = fieldsetsList.fieldsets;
        }
        this.selectedSchema.isSchemaValid = true;
   
      } catch (error) {
        console.log(error);
        this.selectedSchema.properties = {};
        this.selectedSchema.isSchemaValid = false;
      }
      
  }

  getJobs(): void {
    this.workflowService.getAllJobs(this.workflow).pipe(
      map(data => {
        return data.jobs;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.jobs = data;
      this.populateGraph(data);
      this.updateGraph();
      this.resetJobOutputs();
      for (let job of data) {
        this.populateJobOutputs(job);
      }
    });
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

  // Create workflow DAG
  populateGraph(data: Job[]) {
    this.nodes = [];
    this.links = [];
    for (const job of data) {
      const node = {id: job.id, label: job.name};
      this.nodes.push(node);
      if (job.dependencies.length > 0) {
        for (let i = 0; i < job.dependencies.length; i ++) {
          const link = {id: 'link', source: job.dependencies[i], target: job.id};
          this.links.push(link);
        }
      }
    }
  }

  // Update workflow DAG
  updateGraph() {
    this.update$.next(true);
  }
  
  resetJobOutputs() {
    this.jobOutputs = {
      collections: [],
      stitchingVectors: [],
      tensorflowModels: [],
      csvCollections: [],
      notebooks: []
    };
  }

  updateArgoUrl() {
    if (this.workflow.generatedName) {
      this.argoUiLink = urljoin(this.argoUiBaseUrl, this.workflow.generatedName);
    }
  }

  stubCategory_Institution() {
    /*for(let i=0; i< this.pluginList.length; i++) {
      this.pluginList[i].category = "category" + i%4;
    }*/
    this.categoryList = ['cat0', 'cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6'];
    this.institutionList = ['National Institute of Standards and Technology', 'ISIMA', 'Isima'];
    //Suppression des dupllications
    this.categoryList = this.categoryList.filter((n,i) => this.categoryList.indexOf(n)===i && n!=null);
    this.institutionList = this.institutionList.filter((n,i) => this.institutionList.indexOf(n)===i);
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
