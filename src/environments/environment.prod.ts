import packageInfo from '../../package.json';

export const environment = {
  production: true,
  version: packageInfo.version,
  apiRootUrl: '/api',
  keycloak: {
    url: '@KEYCLOAK_URL_VALUE@',
    realm: 'WIPP',
    clientId: 'wipp-public-client'
  },
  iipRootUrl: '@IIP_URL_VALUE@',
  annotationApiRootUrl: '@ANNOTATION_API_URL_VALUE@'
};
