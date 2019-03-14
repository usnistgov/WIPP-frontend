import {Component, OnInit} from '@angular/core';
import {PluginService} from '../plugin.service';
import {ActivatedRoute} from '@angular/router';
import * as Flow from '@flowjs/flow.js';
import {Plugin} from '../plugin';


@Component({
  selector: 'app-plugin-detail',
  templateUrl: './plugin-detail.component.html',
  styleUrls: ['./plugin-detail.component.css']
})
export class PluginDetailComponent implements OnInit {

  constructor(private pluginService: PluginService,
              private route: ActivatedRoute
  ) {
  }

  flowHolder: Flow.IFlow;
  plugin: Plugin = new Plugin();
  uiKeys: string[][] = [];
  outputKeys: string[][] = [];
  inputKeys: string[][] = [];
  inputOptionsKeys: string[][] = [];
  outputOptionsKeys: string[][] = [];
  viewInputs = false;
  viewOutputs = false;
  viewUI = false;

  ngOnInit() {
    this.flowHolder = new Flow({
      uploadMethod: 'POST',
      method: 'octet'
    });
    this.getPlugin();
  }


  getPlugin(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pluginService.getPlugin(id)
      .subscribe(plugin => {
        this.assignJsonData(plugin);
        this.populatePage();
      });
  }

  /**
   * Assign the Json type to the corresponding plugin fields
   */
  assignJsonData(plugin: Plugin) {
    this.plugin = plugin;
    this.plugin.inputs = JSON.parse(JSON.stringify(plugin.inputs));
    this.plugin.outputs = JSON.parse(JSON.stringify(plugin.outputs));
    this.plugin.ui = JSON.parse(JSON.stringify(plugin.ui));
  }

  /**
   * Get the data to populate the HTML page
   */
  populatePage() {
    this.getJson([this.plugin.inputs, this.plugin.outputs, this.plugin.ui],
      [this.inputKeys, this.outputKeys, this.uiKeys]);
    this.getJsonOptions([this.plugin.inputs, this.plugin.outputs],
      [this.inputOptionsKeys, this.outputOptionsKeys]);
  }

  /**
   * Get the list (keys) of fields for the output, input and UI values of the plugin
   */
  getJson(fields: JSON[][], keyLists: string[][][]) {
    for (let i = 0; i < fields.length; i++) {
      const keyList = keyLists[i];
      const field = fields[i];
      for (const line of Object.keys(field)) {
        const key = field[line]; // line of json
        const keys = Object.keys(key);
        keyList.push(keys);
      }
    }
  }

  /**
   * Get the list (keys) of the option field of the output and input values of the plugin
   */
  getJsonOptions(fields: JSON[][], keys: string[][][]) {
    for (let i = 0; i < fields.length; i++) {
      const list = [];
      const field = fields[i];
      const key = keys[i];
      for (const line of Object.keys(field)) {
        const key1 = field[line]; // line of json
        const keys1 = Object.keys(key1);
        const val1 = Object.values(key1);
        for (let j = 0; j < keys1.length; j++) {
          if (val1[j] != null && Object.keys(field[line][keys1[j]]).length === 1) {
            if (!(list.indexOf(Object.keys(field[line][keys1[j]]).toString()) > -1)) {
              list.push(Object.keys(field[line][keys1[j]]).toString());
              key.push(Object.keys(field[line][keys1[j]]));
            }
          }
        }
      }
    }
  }

  /**
   * Show the content of the input / output / ui
   */
  showContent(view: string) {
    if (view === 'ui') {
      this.viewUI = !this.viewUI;
    } else if (view === 'input') {
      this.viewInputs = !this.viewInputs;
    } else if (view === 'output') {
      this.viewOutputs = !this.viewOutputs;
    }
  }

}
