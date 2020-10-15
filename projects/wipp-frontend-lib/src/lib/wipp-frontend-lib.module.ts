import { NgModule, ModuleWithProviders } from '@angular/core';
import { WippFrontendLibComponent } from './wipp-frontend-lib.component';
import { API_ROOT_URL } from './injection-token';
import { PageNotFoundComponent } from './not-found/not-found.component';
import { DefaultLibConfiguration, LibConfiguration, WippFrontendLibConfigurationProvider } from './wipp-frontend-lib-configuration';

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

  // static forRoot(url: string, config: any): ModuleWithProviders<WippFrontendLibModule> {
  //   return {
  //     ngModule: WippFrontendLibModule,
  //     providers: [
  //       { provide: CONFIG, useValue: config },
  //       { provide: API_ROOT_URL, useValue: url }
  //     ]
  //   };
  // }

  static forRoot(url: string, libConfiguration: LibConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: WippFrontendLibModule,
      providers: [
        libConfiguration.config || {
          provide: WippFrontendLibConfigurationProvider,
          useClass: DefaultLibConfiguration
        },
        { provide: API_ROOT_URL, useValue: url }

      ]
    };
  }

}
