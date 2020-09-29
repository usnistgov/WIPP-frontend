import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CsvCollectionDetailComponent} from './csv-collection-detail/csv-collection-detail.component';
import {CsvCollectionListComponent} from './csv-collection-list/csv-collection-list.component';

const csvCollectionsRoutes: Routes = [
  { path: 'csv-collections', component: CsvCollectionListComponent },
  { path: 'csv-collections/:id', component: CsvCollectionDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(csvCollectionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class CsvCollectionRoutingModule {}
