import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  keycloak: {
    url: '@KEYCLOAK_URL_VALUE@',
    realm: 'WIPP',
    clientId: 'wipp-public-client'
  }
};
