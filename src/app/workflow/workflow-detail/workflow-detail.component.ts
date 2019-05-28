import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';
import {MatPaginator} from '@angular/material';
import {merge, Observable, of, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap, tap} from 'rxjs/operators';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {Job} from '../../job/job';

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
  availableOutputs = {
    collections: [],
    stitchingVectors: []
  };
  jobs: Job[] = [];
  displayedColumnsJobs: string[] = ['index', 'type', 'name'];
  resultsLength = 0;
  pageSize = 20;
  workflowId = this.route.snapshot.paramMap.get('id');

  @ViewChild('jobsPaginator') jobsPaginator: MatPaginator;

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
      task['wippExecutable'] = this.selectedSchema.id; // = id of thresholdPlugin
      task['wippWorkflow'] = this.workflow.id;
      task['type'] = this.selectedSchema.name;
      task['dependencies'] = [];
      task['parameters'] = {};
      task['outputs'] = [];
      task['stitchingVectorsOutputs'] = [];
      // add job outputs
      this.selectedSchema.outputs.forEach(output => {
          if (output.type === 'collection') {
            const outputCollection = {
              // id: '{{ ' + this.workflow.id + '.' + output.name + ' }}', // change (this is workflow ID ! )
              name: '{{ ' + this.workflow.name + '-' + result.taskName + '.' + output.name + ' }}',
              type: output.type,
              sourceJob: this.workflow.id,
              virtual: true
            };
            task['outputs'].push(outputCollection);
          } else if (output.type === 'stitchingVector') {
            const outputStitchingVector = {
              // id: '{{ ' + this.workflow.id + '.' + output.name + ' }}',
              name: '{{ ' + this.workflow.name + '-' + result.taskName + '.' + output.name + ' }}',
              type: output.type,
              sourceJob: this.workflow.id,
              virtual: true
            };
            task['outputs'].push(outputStitchingVector);
            // this.jobOutputs.stitchingVectors.push(outputStitchingVector);
          }
      });
      // add job parameters
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
      this.workflowService.createJob(task).subscribe( job => {
        // this.selectedSchema.outputs.forEach(output => {
          // if (output.type === 'collection') {
          //   const outputCollection = {
          //     id: '{{ ' + job.id + '.' + output.name + ' }}',
          //     name: '{{ ' + job.name + '.' + output.name + ' }}',
          //     sourceJob: job['id'],
          //     virtual: true
          //   };
          //   this.jobOutputs.collections.push(outputCollection);
          // } else if (output.type === 'stitchingVector') {
          //   const outputStitchingVector = {
          //     id: '{{ ' + job.id + '.' + output.name + ' }}',
          //     name: '{{ ' + job.name + '.' + output.name + ' }}',
          //     sourceJob: job['id'],
          //     virtual: true
          //   };
          //   this.jobOutputs.stitchingVectors.push(outputStitchingVector);
          // }
        // });
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
        'taskName':  {
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
      // TODO: validation of plugin ui description
      plugin.inputs.forEach(input => {
        const inputSchema = {};
        // common properties
        inputSchema['key'] = 'inputs.' + input.name;
        inputSchema['description'] = input.description;
        if (input.required) {
          plugin.properties.inputs.required.push(input.name);
        }

        // type-specific properties
        switch (input.type) {
          case 'collection':
            inputSchema['type'] = 'string';
            inputSchema['widget'] = 'search';
            inputSchema['format'] = 'collection';
            inputSchema['format_type'] = input.options.format;
            // inputSchema['getOutputCollections'] = () => this.jobOutputs.collections;
            inputSchema['getOutput'] = (type) => this.setOutput(type);
            break;
          case 'stitchingVector':
            inputSchema['type'] = 'string';
            inputSchema['widget'] = 'search';
            inputSchema['format'] = 'stitchingVector';
            inputSchema['format_type'] = input.options.format;
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
        plugin.properties.inputs.properties[input.name] = inputSchema;
      });
    });
  }

  getJobs(): void {
    merge(this.jobsPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const params = {
            pageIndex: this.jobsPaginator.pageIndex,
            size: this.pageSize
          };
          return this.workflowService.getJobs(this.workflow, params);
        }),
        map(data => {
          this.resultsLength = data.page.totalElements;
          return data.jobs;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.jobs = data);
  }

  displayJobModal(jobId: string) {
   const modalRef = this.modalService.open(JobDetailComponent);
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {}
    , (reason) => {
      console.log('dismissed');
    });
  }

  setOutput(type: string): Observable<Object> {
    const availableOutputsObs = of(this.availableOutputs);
     this.workflowService.getJobs(this.workflow, null).pipe(
      map (result => result.jobs),
    ).subscribe(res => {
    for (const job of res) {
      for (const output of job.outputs) {
       if (output.type === 'collection'  && !this.availableOutputs.collections.some(x => x.name === output.name)) {
          this.availableOutputs.collections.push(output);
        } else if (output.type === 'stitchingVector' && !this.availableOutputs.stitchingVectors.some(x => x.name === output.name)) {
          this.availableOutputs.stitchingVectors.push(output);
        }
      }
    }
     });
      if (type === 'collection') {
        return availableOutputsObs['value']['collections'];
      } else if (type === 'stitchingVector') {
         return availableOutputsObs['value']['stitchingVector'];
      }
  }

}
