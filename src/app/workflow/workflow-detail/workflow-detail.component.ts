import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';
import {MatPaginator} from '@angular/material';
import {of as observableOf, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';
import {FormProperty, PropertyGroup} from '../../../../node_modules/ngx-schema-form/lib/model/formproperty';


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
    stitchingVectors: []
  };
  jobs: Job[] = [];
  workflowId = this.route.snapshot.paramMap.get('id');

  update$: Subject<any> = new Subject();
  nodes = [];
  links = [];
  depthWidth;
  depthHeight;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private pluginService: PluginService,
    private workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow =>
      this.workflow = workflow);
    this.pluginService.getPlugins(null)
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
         console.log(output)
         task['outputParameters'][output.name] = 'NAN';
       })

      for (const inputEntry in result.inputs) {
        if (result.inputs.hasOwnProperty(inputEntry)) {
          const type = this.selectedSchema.properties.inputs.properties[inputEntry]['format'];
          let value = result.inputs[inputEntry];
          if (type === 'collection' || type === 'stitchingVector') {
            if (value.hasOwnProperty('virtual') && value.virtual === true && value.hasOwnProperty('sourceJob')) {
              task['dependencies'].push(value.sourceJob);
            }
            value = value.hasOwnProperty('id') ? value.id : null;
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
    this.workflowService.submitWorkflow(this.workflow)
      .subscribe(result => location.reload());
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
          'placeholder': 'Enter a name for this task'
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
      this.updateGraph(); } );
  }

  displayJobModal(jobId: string) {
    const modalRef = this.modalService.open(JobDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
      }
      , (reason) => {
        console.log('dismissed');
      });
  }

  populateGraph(data: Job[]) {
    this.nodes = [];
    this.links = [];
    for (const job of data) {
      const node = {id : job.id, label: job.name};
      this.nodes.push(node);
      if ( job.dependencies.length > 0 ) {
        const link = {id: 'link', source: job.dependencies[0], target: job.id};
        this.links.push(link);
      }
    }
    this.getGraphWidth();
    this.getGraphHeight();
  }

  getGraphWidth() {
    let depth = 1;
    let tempDepth;
    for ( const link of this.links ) {
      tempDepth = 1;
      let target = link.target;
      let flag = true;
      while (flag) {
        if (this.links.some(x => x.source === target)) {
          tempDepth = tempDepth + 1;
          target = this.links.find(x => x.source === target).target;
        } else {flag = false; }
      }
      depth = Math.max(depth, tempDepth);
    }
    this.depthWidth = depth;
  }

  getGraphHeight() {
    let depthHeight = 0;
    for ( const node of this.nodes ) {
      if (!this.links.some(x => x.target === node.id)) {
        depthHeight ++;
      }
      let nbOfChild = 0 ;
      if (this.links.some(x => x.source === node.id) ) {
        for (const node2 of this.nodes) {
          if (this.links.some(x => x.source === node.id && x.target === node2.id) ) {
            nbOfChild ++;
            if (nbOfChild === 2) {
            }
          }

        }
      }
      if (nbOfChild > 1) {depthHeight += nbOfChild - 1; }
    }
    this.depthHeight = depthHeight;
  }

// Update function
  updateGraph() {
    this.update$.next(true);
  }

}
