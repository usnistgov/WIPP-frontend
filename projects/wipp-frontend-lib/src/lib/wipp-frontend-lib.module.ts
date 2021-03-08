import { NgModule, ModuleWithProviders } from '@angular/core';
import { WippFrontendLibComponent } from './wipp-frontend-lib.component';
import { ENV } from './injection-token';
import { PageNotFoundComponent } from './not-found/not-found.component';
import { DefaultLibConfiguration, LibConfiguration, WippFrontendLibConfigurationProvider } from './wipp-frontend-lib-configuration';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';

@NgModule({
  declarations: [WippFrontendLibComponent, PageNotFoundComponent, ForbiddenAccessComponent],
  imports: []
})
export class WippFrontendLibModule {
  static forRoot(env: any, libConfiguration: LibConfiguration = {}): ModuleWithProviders <WippFrontendLibModule> {
    return {
      ngModule: WippFrontendLibModule,
      providers: [
        libConfiguration.config || {
          provide: WippFrontendLibConfigurationProvider,
          useClass: DefaultLibConfiguration
        },
        { provide: ENV, useValue: env }
      ]
    };
  }
}
