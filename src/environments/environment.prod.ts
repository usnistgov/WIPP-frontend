import { version } from '../../package.json';

export const environment = {
  production: true,
  version: version,
  apiRootUrl: '/api',
  tensorboardUrl: '/tensorboard',
  jupyterNotebooksUrl: 'http://j.ci.aws.labshare.org',
  plotsUiUrl: 'http://vision-ui.ci.aws.labshare.org'
};
