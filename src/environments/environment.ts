// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { version } from '../../package.json';

export const environment = {
  production: false,
  version: version,
  registryAPI: 'http://129.6.18.170:8081/rest/data',
  // registryAPI: 'http://192.168.1.162/rest/data',
  // registryAPI: 'https://test-wipp-plugins.nist.gov/rest/data',
  // getUrl : 'http://mgi_superuser:mgi_superuser_pwd@localhost:8111/rest/data',
  apiRootUrl: 'http://localhost:8080/api'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
