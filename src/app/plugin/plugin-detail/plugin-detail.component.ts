import {Component, OnDestroy, OnInit} from '@angular/core';
import {PluginService} from '../plugin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Plugin} from '../plugin';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakService} from '../../services/keycloak/keycloak.service';


@Component({
  selector: 'app-plugin-detail',
  templateUrl: './plugin-detail.component.html',
  styleUrls: ['./plugin-detail.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PluginDetailComponent implements OnInit, OnDestroy {

  constructor(private pluginService: PluginService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router,
              private keycloakService: KeycloakService
  ) {
  }

  plugin: Plugin = new Plugin();
  columnsToDisplayInputs = ['name', 'description', 'type', 'required'];
  columnsToDisplayOutputs = ['name', 'description', 'type'];
  expandedInput: JSON[] | null;
  manifest: JSON | null;

  ngOnInit() {
    this.getPlugin();
  }

  getPlugin(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pluginService.getPlugin(id)
      .subscribe(plugin => {
        this.plugin = plugin;
        this.curateManifest();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getInputUi(inputName: string) {
    const inputKey = 'inputs.' + inputName;
    return this.plugin.ui.find(ui => ui['key'] === inputKey);
  }

  curateManifest() {
    const pluginCopy = JSON.parse(JSON.stringify(this.plugin));
    delete pluginCopy.id;
    delete pluginCopy.creationDate;
    delete pluginCopy._links;
    this.manifest = pluginCopy;
  }

  displayManifest(content) {
    this.modalService.open(content, {'size': 'lg'});
  }

  canEdit() {
    return (this.keycloakService.isLoggedIn()
      && (this.keycloakService.hasRole('admin') || this.keycloakService.hasRole('developer')));
  }

  deletePlugin(): void {
    if (confirm('Are you sure you want to delete the plugin ' + this.plugin.name + ' v' + this.plugin.version + '?')) {
      this.pluginService.deletePlugin(this.plugin).subscribe(plugin => {
        this.router.navigate(['plugins']);
      });
    }
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

}
