import {Component, Input, OnInit} from '@angular/core';
import {PluginService} from '../../plugin/plugin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkflowService} from '../workflow.service';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../workflow';

@Component({
  selector: 'app-workflow-create',
  templateUrl: './workflow-create.component.html',
  styleUrls: ['./workflow-create.component.css']
})
export class WorkflowCreateComponent implements OnInit {

  workflow: Workflow = new Workflow();
  id = this.route.snapshot.paramMap.get('id');
  workflowSteps = [];
  workflowStepId = 1;
  jobOutputs = {
    collections: []
  };

  defaultSchema = null;
  defaultSchemaName = '';

  pluginList = [];
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private pluginService: PluginService,
    private workflowService: WorkflowService) { }

  ngOnInit() {
    // this.workflowService.resetCollection();
    this.workflowService.getWorkflow(this.id).subscribe(workflow =>
      this.workflow = workflow);
    this.pluginService.getPlugins(null)
      .subscribe(plugins => {
        this.pluginList = plugins.plugins;
        this.generateSchema(this.pluginList);
        this.resetForm();
      });
  }

  resetForm() {
    this.defaultSchemaName = this.pluginList[0].name;
    this.defaultSchema = this.pluginList[0]; // .properties;
    // this.workflowService.getSchemaForm(this.defaultSchemaName)
    //   .subscribe(schema => this.defaultSchema = schema);
  }

  open(content) {
    this.modalService.open(content, {'size': 'lg'}).result.then((result) => {
      const jsonStep = {};

      // configure job
      jsonStep['step'] = this.workflowStepId;
      jsonStep['name'] = this.workflow.name + '-' + this.workflowStepId;
      console.log(this.defaultSchema);
      console.log(result);
      jsonStep['wippExecutable'] = this.defaultSchema.id;
      jsonStep['wippWorkflow'] = this.workflow.id;
      jsonStep['type'] = this.defaultSchemaName;
      jsonStep['dependencies'] = [];
      jsonStep['parameters'] = {
      };
      // add job parameters
      for (const inputEntry in result.inputs) {
        if (result.inputs.hasOwnProperty(inputEntry)) {
          const type = this.defaultSchema.properties.inputs.properties[inputEntry]['format'];
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
      console.log(jsonStep);
      // push job
      this.workflowService.createJob(jsonStep).subscribe(job => {
        this.workflowSteps.push(jsonStep);
        // add job outputs to list of available outputs for next steps
        this.defaultSchema.outputs.forEach(output => {
          if (output.type === 'collection') {
            const outputCollection = {
              id: '{{ step.' + this.workflowStepId + '.output }}',
              name: '{{ step.' + this.workflowStepId + '.output }}',
              sourceJob: job['id'],
              virtual: true
            };
            this.jobOutputs.collections.push(outputCollection);
            console.log(this.jobOutputs);
          }
        });
        this.workflowStepId += 1;
        this.resetForm();
      });
    }, (result) => {
      this.resetForm();
    });
  }

  updateSchema(schemaName) {
    // this.workflowService.getSchemaForm(schemaName)
    //   .subscribe(schema => this.defaultSchema = schema);

    this.defaultSchemaName = schemaName;
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
        console.log(plugin);
      });
    });
  }
}
