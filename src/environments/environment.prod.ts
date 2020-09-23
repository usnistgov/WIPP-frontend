import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  keycloak: {
    url: '/auth',
    realm: 'WIPP',
    clientId: 'wipp-public-client'
  }
};
