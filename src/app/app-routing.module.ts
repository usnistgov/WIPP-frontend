import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './not-found/not-found.component';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/images-collections', pathMatch: 'full' },
  { path: '403/:path', component: ForbiddenAccessComponent }, // we route the 403 page to ForbiddenAccessComponent
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
