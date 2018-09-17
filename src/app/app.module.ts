import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagesCollectionModule } from './images-collection/images-collection.module';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule} from '@angular/material';
import {ImagesCollectionNewComponent} from './images-collection/images-collection-new/images-collection-new.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ImagesCollectionModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
