import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PluginListComponent} from './plugin-list/plugin-list.component';
import {PluginDetailComponent} from './plugin-detail/plugin-detail.component';

const pluginsRoutes: Routes = [
  { path: 'plugins', component: PluginListComponent },
  { path: 'plugins/:id', component: PluginDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pluginsRoutes),
  ],
  exports: [
    RouterModule
  ]
})

export class PluginRoutingModule {}
