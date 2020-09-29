import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'projects/wipp-frontend-lib/src/public-api';


const appRoutes: Routes = [
    { path: '',   redirectTo: '/images-collections', pathMatch: 'full' },
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