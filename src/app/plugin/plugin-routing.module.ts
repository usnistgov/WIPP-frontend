import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PluginListComponent} from './plugin-list/plugin-list.component';

const pluginsRoutes: Routes = [
  { path: 'plugins', component: PluginListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pluginsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PluginRoutingModule {}
