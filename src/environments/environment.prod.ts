import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  tensorboardUrl: '/tensorboard',
  jupyterNotebooksUrl: 'JUPYTERHUB_URL',
  plotsUiUrl: 'VISIONUI_URL'
};
