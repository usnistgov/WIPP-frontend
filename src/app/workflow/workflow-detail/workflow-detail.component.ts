import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';
import {MatPaginator} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Job} from '../job';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css']
})

export class WorkflowDetailComponent implements OnInit {

  workflow: Workflow = new Workflow();
  workflowSteps = [];
  workflowStepId = 1;
  selectedSchema = null;
  pluginList = [];
  jobOutputs = {
    collections: []
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
      const jsonStep = {};

      // configure job
      jsonStep['step'] = this.workflowStepId;
      jsonStep['name'] = this.workflow.name + '-' + this.workflowStepId;
      jsonStep['wippExecutable'] = this.selectedSchema.id;
      jsonStep['wippWorkflow'] = this.workflow.id;
      jsonStep['type'] = this.selectedSchema.name;
      jsonStep['dependencies'] = [];
      jsonStep['parameters'] = {};
      // add job parameters
      for (const inputEntry in result.inputs) {
        if (result.inputs.hasOwnProperty(inputEntry)) {
          const type = this.selectedSchema.properties.inputs.properties[inputEntry]['format'];
          let value = result.inputs[inputEntry];
          if (type === 'collection') {
            if (value.hasOwnProperty('virtual') && value.virtual === true && value.hasOwnProperty('sourceJob')) {
              jsonStep['dependencies'].push(value.sourceJob);
            }
            value = value.hasOwnProperty('id') ? value.id : null;
          }
          jsonStep['parameters'][inputEntry] = value;
        }
      }
      // push job
      this.workflowService.createJob(jsonStep).subscribe(job => {
        this.workflowSteps.push(jsonStep);
        // add job outputs to list of available outputs for next steps
        this.selectedSchema.outputs.forEach(output => {
          if (output.type === 'collection') {
            const outputCollection = {
              id: '{{ step.' + this.workflowStepId + '.output }}',
              name: '{{ step.' + this.workflowStepId + '.output }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.collections.push(outputCollection);
          }
        });
        this.workflowStepId += 1;
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
            const self = this;
            inputSchema['getOutputCollections'] = () => this.jobOutputs.collections;
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
}