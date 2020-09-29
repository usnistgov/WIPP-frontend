import { NgModule, ModuleWithProviders } from '@angular/core';
import { WippFrontendLibComponent } from './wipp-frontend-lib.component';
import {API_ROOT_URL, CONFIG} from './injection-token';
import { PageNotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [WippFrontendLibComponent, PageNotFoundComponent],
  imports: [
  ],
  exports: [WippFrontendLibComponent, PageNotFoundComponent]
})
export class WippFrontendLibModule {

  static forRootUsingUrl(url: string): ModuleWithProviders<WippFrontendLibModule> {
    return {
      ngModule: WippFrontendLibModule,
      providers: [
        { provide: API_ROOT_URL, useValue: url }
      ]
    };
  }

  static forRoot(url: string, config: any): ModuleWithProviders<WippFrontendLibModule> {
    return {
      ngModule: WippFrontendLibModule,
      providers: [
        { provide: CONFIG, useValue: config },
        { provide: API_ROOT_URL, useValue: url }
      ]
    };
  }

 }
