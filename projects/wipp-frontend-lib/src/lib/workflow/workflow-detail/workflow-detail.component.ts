import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { PluginService } from '../../plugin/plugin.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowService } from '../workflow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Workflow } from '../workflow';
import { forkJoin, interval, of as observableOf, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JobDetailComponent } from '../../job/job-detail/job-detail.component';
import { Job } from '../../job/job';
import { FormProperty, PropertyGroup } from 'ngx-schema-form/lib/model/formproperty';
import { ModalErrorComponent } from '../../modal-error/modal-error.component';
import { NgxSpinnerService } from 'ngx-spinner';
import urljoin from 'url-join';
import { JobService } from '../../job/job.service';
import { dataMap } from '../../data-service';
import { WorkflowNewComponent } from '../workflow-new/workflow-new.component';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { animate, transition, trigger } from '@angular/animations';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.css'],
  animations: [trigger('direction', [transition('right <=> left', [animate('.2s 0s ease-out')])])]
})

export class WorkflowDetailComponent implements OnInit, OnDestroy {
  @Input() public arrowState = false;
  public wfMenuChecked = true;
  public isCollapsed = false;
  public panelOpenState = false;
  public color: ThemePalette = 'accent';
  modalReference: NgbModalRef;

  workflow: Workflow = new Workflow();

  selectedSchema = null;
  pluginList = [];
  jobOutputs = {
    collection: [],
    stitchingVector: [],
    pyramidAnnotation: [],
    pyramid: [],
    tensorflowModel: [],
    tensorboardLogs: [],
    csvCollection: [],
    notebook: [],
    genericDataCollection: []
  };
  jobs: Job[] = [];
  workflowId = this.route.snapshot.paramMap.get('id');
  jobModel = {};
  editMode = false;
  editModeInMenu = false;
  copyMode = false;
  modalOpen = false;
  colorMap: Map<string, string>;


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
    private jobService: JobService,
    private keycloakService: KeycloakService,
    private injector: Injector,
    private router: Router) {
  }

  ngOnInit() {
    this.argoUiBaseUrl = this.workflowService.getArgoUiBaseUrl();
    this.workflowService.getWorkflow(this.workflowId).subscribe(workflow => {
      this.workflow = workflow;
      this.updateArgoUrl();
    }, error => {
      this.router.navigate(['/404']);
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
    this.modalOpen = true;
    this.modalReference = this.modalService.open(content, { 'size': 'lg' });
    this.modalReference.result.then((result) => {
      this.setTask(result);
    }, (result) => {
      this.resetForm();
    });
  }

  addTaskInMenu() {
    this.resetForm();
    this.editModeInMenu = false;
    this.copyMode = false;
    this.isCollapsed = !this.isCollapsed;
  }

  closeTask(value) {
    if (this.modalOpen) {
      this.modalReference.close(value);
    } else {
      if (this.copyMode == false) {
        this.isCollapsed = false;
      } else {
        this.copyMode = !this.copyMode;
      }
      if (this.editModeInMenu == false) {
        this.isCollapsed = false;
      } else {
        this.editModeInMenu = !this.editModeInMenu;
      }
      this.setTask(value);
    }
  }

  setTask(result) {
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
          type === 'pyramidAnnotation' ||
          type === 'tensorflowModel' ||
          type === 'csvCollection' ||
          type === 'notebook' ||
          type === 'genericDataCollection') {
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

  copyWorkflow() {
    const modalRef = this.modalService.open(WorkflowNewComponent);
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.componentInstance.isCopy = true;
    modalRef.result.then((result) => {
      this.spinner.show();
      this.workflowService.copyWorkflow(this.workflow, result.name).subscribe(workflow => {
        const workflowId = workflow ? workflow.id : null;
        this.router.navigate(['../' + this.workflowService.getWorkflowUiPath() + '/detail', workflowId]).then(() => {
          this.spinner.hide();
          this.refreshPage();
        });
      }, error => {
        this.spinner.hide();
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Workflow copy failed';
        modalRefErr.componentInstance.message = error.error;
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }

  refreshPage() {
    window.location.reload();
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
        // default validator - none
        plugin.schemaValidator = {};
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
            case 'pyramidAnnotation':
            case 'pyramid':
            case 'tensorflowModel':
            case 'csvCollection':
            case 'notebook':
            case 'genericDataCollection':
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
            case 'radio':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'radio';
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
            // Workaround for https://github.com/guillotinaweb/ngx-schema-form/issues/332
            case 'number':
            case 'float':
              inputSchema['type'] = 'string';
              inputSchema['widget'] = 'integer';
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
            // case when the condition contains the AND operator
            if (ui.condition.includes('&&')) {
              inputSchema['visibleIf'] = {};
              inputSchema['visibleIf']['allOf'] = [];
              const conditionElements = ui.condition.split('&&');
              conditionElements.forEach(element => {
                element = element.replace(/\s/g, '');
                const conditionElements = element.split('==');
                if (conditionElements.length === 2) {
                  const inputName = conditionElements[0].split('.');
                  // condition string must not contain single quotes
                  var conditionElem = conditionElements[1].replace(/\'/g, "");
                  // check if the condition element string is equals to true or false and then converting it to a boolean 
                  conditionElem = conditionElem === 'true' ? true : conditionElem === 'false' ? false : conditionElem;
                  if (inputName.length > 0) {
                    inputSchema['visibleIf']['allOf'].push({
                      [inputName[inputName.length - 1]]: conditionElem
                    });
                  }
                }
              });
            }
            else {
              const conditionElements = ui.condition.split('==');
              if (conditionElements.length === 2) {
                const inputName = conditionElements[0].split('.');
                // condition string must not contain single quotes
                var conditionElem = conditionElements[1].replace(/\'/g, "");
                if (conditionElem.includes(',')) {
                  // converting the string containing multiple conditions into an array
                  // ngx-schema-form's schema no longer accepts an array string in the visibleif property 
                  conditionElem = conditionElem.split(",");
                  conditionElem[0] = conditionElem[0].substring(1);
                  conditionElem[conditionElem.length - 1] = conditionElem[conditionElem.length - 1]
                    .substring(0, conditionElem[conditionElem.length - 1].length - 1);
                  conditionElem.forEach((x, i) => {
                    conditionElem[i] = conditionElem[i].includes('"') ? conditionElem[i].replaceAll('"', "").trim()
                      : conditionElem[i].replaceAll("'", "").trim();
                  });
                }
                // check if the condition element string is equals to true or false and then converting it to a boolean 
                conditionElem = conditionElem === 'true' ? true : conditionElem === 'false' ? false : conditionElem;
                if (inputName.length > 0) {
                  inputSchema['visibleIf'] = {};
                  inputSchema['visibleIf'][inputName[inputName.length - 1]] = conditionElem;
                }
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

        // advanced validation with ngx-schema-form 
        if (plugin.validators) {
          plugin.schemaValidator = {
            "/inputs": (value, property, form) => {
              const parent: PropertyGroup = property.findRoot();
              const inputProperties = parent.schema.properties.inputs.properties;
              // resetting values of every enum or radio property to original values
              plugin.inputs.forEach(input => {
                if (input.type == 'enum' || input.type == 'radio') {
                  inputProperties[input.name]['oneOf']= [];
                  input.options.values.forEach(value => {
                    inputProperties[input.name]['oneOf'].push({
                      'enum': [value],
                      'description': value
                    });
                  });
                }
              });
              // loop over validators objects
              for (const validatorObj of plugin.validators) {
                let validatorCond = validatorObj.condition;
                let builtCondition = this.buildCondition(validatorCond, value);
                if (builtCondition) {
                  for (const thenStatement of validatorObj.then) {
                    const thenAction = thenStatement.action;
                    const targetValues = thenStatement.values;
                    const targetProp = inputProperties[thenStatement.input];
                    this.runAction(targetProp, targetValues, thenAction);
                  }
                }
              }
            }
          }
        }
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
    const modalRef = this.modalService.open(JobDetailComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modalReference = modalRef;
    (modalRef.componentInstance as JobDetailComponent).jobId = jobId;
    modalRef.result.then((result) => {
    }, (reason) => {
        console.log('dismissed');
      });
  }

  openCopyInMenu(content, jobId: string) {
    this.resetForm();
    this.copyMode = !this.copyMode;
    this.openTaskMenu(content, jobId);
  }

  openEdit(content, jobId: string) {
    this.editMode = true;
    this.openCopyTaskModal(content, jobId);
  }

  openEditInMenu(content, jobId: string) {
    this.resetForm();
    this.editModeInMenu = !this.editModeInMenu;
    this.editMode = true;
    this.openTaskMenu(content, jobId);
  }

  openCopyTaskModal(content, jobId: string) {
    let requests = [];
    requests = this.populateAndOpenCopyModal(content, jobId);
    if (requests.length === 0) {
      this.open(content);
    } else {
      forkJoin(requests).subscribe(results => {
        for (const result of results) {
          this.jobModel['inputs'][result['inputName']] = result['data'];
        }
        this.open(content);
      });
    }
  }

  openTaskMenu(content, jobId: string) {
    let requests = [];
    requests = this.populateAndOpenCopyModal(content, jobId);
    if (!(requests.length === 0)) {
      forkJoin(requests).subscribe(results => {
        for (const result of results) {
          this.jobModel['inputs'][result['inputName']] = result['data'];
        }
      });
    }
  }

  getDependencies(jobId: String) {
    const jobDependencies = this.jobs.filter(job =>
      job.dependencies.includes(jobId)).length > 0 ? this.jobs.filter(job => job.dependencies.includes(jobId)) : null;
    return (jobDependencies);
  }

  deleteJob(content, jobId: string) {
    const job: Job = this.jobs.find(jobA => jobA.id === jobId);
    const jobDependencies = this.getDependencies(jobId);
    let text = 'Are you sure you want to delete the job ' + job.name + '? \n';
    if (jobDependencies) {
      text += 'This job has dependencies which will be deleted too \n ';
    }
    const requests = [];
    requests.push(this.jobService.deleteJob(job));
    this.deleteDependencies(job, requests);
    if (confirm(text)) {
      forkJoin(requests).subscribe(data => this.getJobs());
    }
  }

  deleteDependencies(job: Job, requests) {
    const dependencies = this.getDependencies(job.id);
    if (dependencies) {
      for (const dependency of dependencies) {
        requests.push(this.jobService.deleteJob(dependency));
        this.deleteDependencies(dependency, requests);
      }
    }
  }

  populateAndOpenCopyModal(content, jobId: string): any[] {
    const requests = [];
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
            this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input].split(',') : null;
          } else {
            // if input to copy is a standard type (string, int...)
            this.jobModel['inputs'][input] = jobToCopy.parameters[input] ? jobToCopy.parameters[input] : null;
          }
        }
      });
    }
    );
    return requests;
  }

  // Create workflow DAG
  populateGraph(data: Job[]) {
    this.nodes = [];
    this.links = [];
    this.colorMap = new Map<string, string>();
    for (const job of data) {
      const node = { id: job.id, label: job.name };
      this.nodes.push(node);
      if (job.dependencies.length > 0) {
        for (let i = 0; i < job.dependencies.length; i++) {
          const link = { id: 'link', source: job.dependencies[i], target: job.id };
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
      pyramidAnnotation: [],
      pyramid: [],
      tensorflowModel: [],
      tensorboardLogs: [],
      csvCollection: [],
      notebook: [],
      genericDataCollection: []
    };
  }

  updateArgoUrl() {
    if (this.workflow.generatedName) {
      this.argoUiLink = urljoin(this.argoUiBaseUrl, this.workflow.generatedName);
    }
  }

  makeWorkflowPublic(): void {
    this.workflowService.makeWorkflowPublic(
      this.workflow).subscribe(workflow => {
        this.refreshPage();
      },
        error => {
          const modalRefErr = this.modalService.open(ModalErrorComponent);
          modalRefErr.componentInstance.title = 'Unable to set workflow to public';
          modalRefErr.componentInstance.message = error.error;
        });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.workflow);
  }

  canCreate(): boolean {
    return (this.keycloakService.isLoggedIn());
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  /**
   * Gets the direction of the arrow used to toggle the right menu
   */
  public get direction(): 'right' | 'left' {
    return this.arrowState ? 'right' : 'left';
  }

  // Get node color and set it in the color map
  getColor(node) {
    this.colorMap.set(node.id, node.data.color);
    return node.data.color;
  }

  // Get node color by job id
  getJobColor(job) {
    return this.colorMap.get(job.id);
  }

  removeValuesFromOneOf(property, values) {
    property.oneOf = property.oneOf.filter(x =>
      !values.includes(x.enum[0])
    );
  }

  addValuesToOneOf(prop, values) {
    prop.oneOf = prop.oneOf.filter(x =>
      values.includes(x.enum[0])
    );
  }

  // choose which action to run and either show or hide values
  runAction(prop, values, action) {
    if (action == "hide") {
      this.removeValuesFromOneOf(prop, values);
    } else if (action == "show") {
      this.addValuesToOneOf(prop, values);
    }
  }

  // check if validator contains multiple conditions or a single condition
  containsMultipleConditions(arr): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].hasOwnProperty('operator')) {
        return true;
      }
    }
    return false;
  }

  // build condition from validator condition object in json schema
  buildCondition(condition, schemaVal): boolean {
    let builtCondition;
    if (this.containsMultipleConditions(condition)) {
      let operator = condition.filter(item => item.operator)[0].operator;
      let subConditions = condition.filter(function (item) {
        return !item.operator;
      });

      for (var i = 0; i < subConditions.length; i++) {
        let currentBuiltCondition = this.buildSingleCondition(subConditions[i].input, subConditions[i].value, subConditions[i].eval, schemaVal);
        if (builtCondition == null) {
          builtCondition = currentBuiltCondition;
        }
        if (operator == "OR" || "||") {
          builtCondition = builtCondition || currentBuiltCondition;
        } else if (operator == "AND" || "&&") {
          builtCondition = builtCondition && currentBuiltCondition;
        }
      }
    } else {
      // single condition 
      let inputProp = condition[0].input;
      let propVal = condition[0].value;
      let propEval = condition[0].eval;
      builtCondition = this.buildSingleCondition(inputProp, propVal, propEval, schemaVal);
    }
    return builtCondition;
  }

  buildSingleCondition(input, val, propEval, schemaVal): boolean {
    if (propEval == "==") {
      return (val == schemaVal[input]);
    } else if (propEval == "!==") {
      return (val !== schemaVal[input]);
    }
  }
}
