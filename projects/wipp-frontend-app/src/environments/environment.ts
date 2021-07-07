// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {version} from '../../../../package.json';

export const environment = {
  production: false,
  version: version,
  apiRootUrl: 'http://localhost:8080/api',
  keycloak: {
      url: 'http://localhost:8081/auth',
      // url: 'https://keycloak-wipp.ci.aws.labshare.org/auth',
      // url: 'https://keycloak-ci.aws.labshare.org/auth',
      realm: 'WIPP',
      clientId: 'wipp-public-client'
  },
  uiPaths: {
    csvCollectionsPath: 'csv-collections',
    genericDatasPath: 'generic-datas',
    imagesCollectionsPath: 'images-collections',
    stitchingVectorsPath: 'stitching-vectors',
    pyramidsPath: 'pyramids',
    pyramidAnnotationsPath: 'pyramid-annotations',
    visualizationsPath: 'pyramid-visualizations',
    tensorflowModelsPath: 'tensorflow-models',
    notebooksPath: 'notebooks',
    workflowsPath: 'workflows',
    pluginsPath: 'plugins' 
  },
  enableTracing: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
