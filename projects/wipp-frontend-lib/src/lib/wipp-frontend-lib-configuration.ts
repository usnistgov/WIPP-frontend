import { Injectable, Provider } from '@angular/core';

export class WippFrontendLibConfiguration {
    argoUiBaseUrl: string;
    tensorboardUrl: string;
    jupyterNotebooksUrl: string;
    plotsUiUrl: string;
    catalogUiUrl: string;
}

@Injectable({ providedIn: 'root' })
export abstract class WippFrontendLibConfigurationProvider {
    abstract get config(): WippFrontendLibConfiguration;
}

@Injectable({ providedIn: 'root' })
export class DefaultLibConfiguration extends WippFrontendLibConfigurationProvider {
    get config(): WippFrontendLibConfiguration {
        // return default config
        return {
            argoUiBaseUrl: `http://localhost:30501/workflows/default`,
            tensorboardUrl: `/not-found`,
            jupyterNotebooksUrl: `/not-found`,
            plotsUiUrl: `/not-found`,
            catalogUiUrl: `/not-found`
        };
    }
}

export class LibConfiguration {
    config?: Provider;
}