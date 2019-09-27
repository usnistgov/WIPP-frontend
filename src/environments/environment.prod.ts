import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  tensorboardUrl: '/tensorboard',
  jupyterNotebooksUrl: '/jupyterLab',
  plotsUiUrl: '/visionUi'
};
