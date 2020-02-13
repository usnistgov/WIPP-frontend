import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';
import {forkJoin, interval, of as observableOf, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppConfigService} from '../../app-config.service';
import urljoin from 'url-join';
import {JobService} from '../../job/job.service';
import {dataMap} from '../../data-service';


@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css']
})

export class WorkflowDetailComponent implements OnInit, OnDestroy {

  workflow: Workflow = new Workflow();

  selectedSchema = null;
  pluginList = [];
  jobOutputs = {
    collection: [],
    stitchingVector: [],
    pyramid: [],
    tensorflowModel: [],
    tensorboardLogs: [],
    csvCollection: [],
    notebook: []
  };
  jobs: Job[] = [];
  workflowId = this.route.snapshot.paramMap.get('id');
  jobModel = {};
  editMode = false;

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

  public data: Array<any>;
  public service: any;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private pluginService: PluginService,
    private workflowService: WorkflowService,
    private appConfigService: AppConfigService,
    private jobService: JobService,
    private injector: Injector) {
  }

  ngOnInit() {
    this.argoUiBaseUrl = this.appConfigService.getConfig().argoUiBaseUrl;
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
      this.workflow = workflow;
      this.updateArgoUrl();
    });
    this.pluginService.getAllPluginsOrderedByName()
      .subscribe(plugins => {
        this.pluginList = plugins.plugins;
        this.generateSchema(this.pluginList);
        this.resetForm();
        this.getJobs();
      });
  }

  resetForm() {
    this.selectedSchema = this.pluginList[0];
    this.jobModel = {};
    this.editMode = false;
  }

  open(content) {
    this.modalService.open(content, {'size': 'lg'}).result.then((result) => {
      const task = {};

      // configure job
      if (this.editMode) {
        task['id'] = this.jobModel['id'];
      }
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
            type === 'pyramid' ||
            type === 'tensorflowModel' ||
            type === 'csvCollection' ||
            type === 'notebook') {
            if (value.hasOwnProperty('virtual') && value.virtual === true && value.hasOwnProperty('sourceJob')) {
              if (task['dependencies'].indexOf(value.sourceJob) === -1) {
                task['dependencies'].push(value.sourceJob);
              }
            }
            value = value.hasOwnProperty('id') ? value.id : null;
          }
          if (type === 'array') {
            value = value.join(',');
          }
          task['parameters'][inputEntry] = value;
        }
      }

      const workflowServiceCall = this.editMode ? this.workflowService.updateJob(task)
        : this.workflowService.createJob(task);
      workflowServiceCall.subscribe(job => {
        this.resetForm();
        this.getJobs();
      }, error => {
        this.resetForm();
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Error while creating new task';
        modalRefErr.componentInstance.message = error.error;
      });
    }, (result) => {
      this.resetForm();
    });
  }

  populateJobOutputs(job) {
    const pluginId = job.wippExecutable;
    const matchingPlugin = this.pluginList.find(x => x.id === pluginId);

    matchingPlugin.outputs.forEach(output => {
      const outputData = {
        id: '{{ ' + job.id + '.' + output.name + ' }}',
        name: '{{ ' + job.name + '.' + output.name + ' }}',
        sourceJob: job['id'],
        virtual: true
      };
      this.jobOutputs[output.type].push(outputData);
    });
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

  generateSchema(pluginList) {
    pluginList.forEach(plugin => {
      plugin.properties = {
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
        plugin.fieldBindings = {};
        // TODO: validation of plugin ui description
        plugin.inputs.forEach(input => {
          const inputSchema = {};
          // common properties
          inputSchema['key'] = 'inputs.' + input.name;
          // inputSchema['description'] = input.description;
          if (input.required) {
            plugin.properties.inputs.required.push(input.name);
          }
          // type-specific properties

          switch (input.type) {
            case 'collection':
            case 'stitchingVector':
            case 'pyramid':
            case 'tensorflowModel':
            case 'csvCollection':
            case 'notebook':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'search';
              inputSchema['format'] = input.type;
              inputSchema['getOutputs'] = () => this.jobOutputs[input.type];
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
          const ui = plugin.ui.find(v => v.key === inputSchema['key']);
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
            plugin.fieldBindings[sourceField] = [
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
            inputSchema['default'] = ui.default;
          }
          plugin.properties.inputs.properties[input.name] = inputSchema;
        });
        // field sets - arrange fields by groups
        const fieldsetsList = plugin.ui.find(v => v.key === 'fieldsets');
        if (fieldsetsList) {
          plugin.properties.inputs.fieldsets = fieldsetsList.fieldsets;
        }
        plugin.isSchemaValid = true;
      } catch (error) {
        console.log(error);
        plugin.properties = {};
        plugin.isSchemaValid = false;
      }
    });
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
      for (const job of data) {
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


  openCopy(content, jobId: string) {
    this.populateAndOpenCopyModal(content, jobId);
  }

  openEdit(content, jobId: string) {
    this.editMode = true;
    this.populateAndOpenCopyModal(content, jobId);
  }

  populateAndOpenCopyModal(content, jobId: string) {
    this.jobService.getJob(jobId).subscribe(jobToCopy => {
        this.jobService.getPlugin(jobToCopy.wippExecutable).subscribe(plugin => {
          this.selectedSchema = this.pluginList.find(x => x.id === plugin.id);
          if (this.editMode) {
            this.jobModel['id'] = jobId;
          }
          this.jobModel['taskName'] = jobToCopy.name.replace(this.workflow.name + '-', '');
          if (!this.editMode) {
            this.jobModel['taskName'] += '-copy';
          }
          this.jobModel['inputs'] = {};
          const requests = [];
          for (const input of Object.keys(jobToCopy.parameters)) {
            // if input to copy is an existing WIPP object
            if (this.selectedSchema.properties.inputs.properties[input]['widget']
               && (this.selectedSchema.properties.inputs.properties[input]['widget'] === 'search'
              || this.selectedSchema.properties.inputs.properties[input]['widget']['id'] === 'search')) {
              if (jobToCopy.parameters[input].indexOf('{') === -1) {
                const id = jobToCopy.parameters[input];
                // Resolve AbstractFactory
                const injectable = dataMap.get(this.selectedSchema.properties.inputs.properties[input]['format']);
                // Inject service
                this.service = this.injector.get(injectable);
                requests.push(this.service.getById(id).pipe(map(response => {
                    response['data'] = response;
                    response['inputName'] = input;
                    return response;
                  })
                ));
              } else {
                // if input to copy is a WIPP object not created yet (output of a previous step not executed)
                this.jobModel['inputs'][input] = {};
                this.jobModel['inputs'][input]['id'] = jobToCopy.parameters[input];
                const prevId = jobToCopy.parameters[input].substring(3, jobToCopy.parameters[input].indexOf('.'));
                const prevOutputName = jobToCopy.parameters[input].substring(
                  jobToCopy.parameters[input].indexOf('.'),
                  jobToCopy.parameters[input].length - 3
                );
                const prevJob = this.jobs.find(x => x.id === prevId);
                this.jobModel['inputs'][input]['name'] = '{{ ' + prevJob.name + prevOutputName + ' }}';
                this.jobModel['inputs'][input]['virtual'] = true;
                this.jobModel['inputs'][input]['sourceJob'] = prevId;
              }
            } else if (this.selectedSchema.properties.inputs.properties[input]['type'] === 'array') {
              // if input to copy is an array of strings joined into a single string
              this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input].split(',') : null ;
            } else {
              // if input to copy is a standard type (string, int...)
              this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input] : null ;
            }
          }
          if (requests.length === 0) {
            this.open(content);
          } else {forkJoin(requests).subscribe(results => {
            for (const result of results) {
              this.jobModel['inputs'][result['inputName']] = result['data'];
            }
            this.open(content);
          });
          }
        });
      }
    );
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
      collection: [],
      stitchingVector: [],
      pyramid: [],
      tensorflowModel: [],
      tensorboardLogs: [],
      csvCollection: [],
      notebook: []
    };
  }

  updateArgoUrl() {
    if (this.workflow.generatedName) {
      this.argoUiLink = urljoin(this.argoUiBaseUrl, this.workflow.generatedName);
    }
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
