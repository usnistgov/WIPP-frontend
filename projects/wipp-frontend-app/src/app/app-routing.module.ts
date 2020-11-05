import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'wipp-frontend-lib';
import { environment } from '../environments/environment';


const appRoutes: Routes = [
    { path: '',   redirectTo: '/images-collections', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: environment.enableTracing } // <-- debugging purposes only
      )],
    exports: [
      RouterModule
    ]
  })
  
  export class AppRoutingModule {}