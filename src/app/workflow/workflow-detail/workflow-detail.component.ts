import {Component, OnInit} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';
import {interval, of as observableOf, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormProperty, PropertyGroup} from 'ngx-schema-form/lib/model/formproperty';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css']
})

export class WorkflowDetailComponent implements OnInit {

  workflow: Workflow = new Workflow();

  selectedSchema = null;
  pluginList = [];
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

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private pluginService: PluginService,
    private workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow =>
      this.workflow = workflow);
    this.pluginService.getPlugins({size: Number.MAX_SAFE_INTEGER, sort: 'name'})
      .subscribe(plugins => {
        this.pluginList = plugins.plugins;
        this.generateSchema(this.pluginList);
        this.resetForm();
        this.getJobs();
      });
  }

  resetForm() {
    this.selectedSchema = this.pluginList[0];
  }

  open(content) {
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
        this.selectedSchema.outputs.forEach(output => {
          if (output.type === 'collection') {
            const outputCollection = {
              id: '{{ ' + job.id + '.' + output.name + ' }}',
              name: '{{ ' + job.name + '.' + output.name + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.collections.push(outputCollection);
          } else if (output.type === 'stitchingVector') {
            const outputStitchingVector = {
              id: '{{ ' + job.id + '.' + output.name + ' }}',
              name: '{{ ' + job.name + '.' + output.name + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.stitchingVectors.push(outputStitchingVector);
          } else if (output.type === 'tensorflowModel') {
            const outputTensorflowModel = {
              id: '{{ ' + job.id + '.' + output.name + ' }}',
              name: '{{ ' + job.name + '.' + output.name + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.tensorflowModels.push(outputTensorflowModel);
          } else if (output.type === 'csvCollection') {
            const outputCsvCollection = {
              id: '{{ ' + job.id + '.' + output.name + ' }}',
              name: '{{ ' + job.name + '.' + output.name + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.csvCollections.push(outputCsvCollection);
          } else if (output.type === 'notebook') {
            const outputNotebook = {
              id: '{{ ' + job.id + '.' + output.name + ' }}',
              name: '{{ ' + job.name + '.' + output.name + ' }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.notebooks.push(outputNotebook);
          }
        });
        this.resetForm();
        this.getJobs();
      });
    }, (result) => {
      this.resetForm();
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
          inputSchema['default'] = input.default;
        }
        plugin.properties.inputs.properties[input.name] = inputSchema;
      });
      // field sets - arrange fields by groups
      const fieldsetsList = plugin.ui.find(v => v.key === 'fieldsets');
      if (fieldsetsList) {
        plugin.properties.inputs.fieldsets = fieldsetsList.fieldsets;
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
        const link = {id: 'link', source: job.dependencies[0], target: job.id};
        this.links.push(link);
      }
    }
  }


  // Update workflow DAG
  updateGraph() {
    this.update$.next(true);
  }
}
