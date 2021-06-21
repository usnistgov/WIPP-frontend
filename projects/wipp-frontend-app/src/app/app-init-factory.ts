import {AppConfigService} from './app-config.service';

export const appInitializerFactory = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};