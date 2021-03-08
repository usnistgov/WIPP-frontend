import {version} from '../../../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  keycloak: {
    url: 'http://localhost:8081/auth',
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
  enableTracing: false
};
