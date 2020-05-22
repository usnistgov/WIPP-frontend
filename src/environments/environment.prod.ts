import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  keycloak: {
    url: 'http://localhost:8081/auth',
    realm: 'WIPPKeycloak',
    clientId: 'wipp-keycloak-client'
  }
};
