# WIPP Frontend

The main WIPP UI application, for uploading images, creating image processing workflows and much more.  
Developped in Angular 7.

## Install dependencies

Run `npm ci` to install dependencies using versions locked in package-lock.json for reproducibility.

## Development setup

#### Configuration

A configuration file defining links between the WIPP-frontend and other tools **must** be placed at 
`src/assets/config/config.json`.  
The following properties are expected to be defined in this file:
- `argoUiBaseUrl`: URL of the Argo Workflows Dashboard, for workflow execution monitoring,
- `tensorboardUrl`: URL of TensorBoard, for TensorFlow jobs monitoring,
- `jupyterNotebooksUrl`: URL of JupyterHub, for Jupyter Notebooks,
- `plotsUiUrl`: URL of Plots app for scatterplots visualization.
- `catalogUiUrl`: URL of Catalog app, for images collections upload, visualization and more.

We provide a sample configuration file `sample-config.json` at the root of this repository defining
a default configuration for the Argo Dashboard URL at `localhost:30501` (sample argo-ui service patch 
to achieve this configuration available 
[here](https://github.com/usnistgov/WIPP/blob/master/deployment/wipp-ci-single-node/argo-service-patch.yaml)).   
This sample configuration file assumes that the other tools are not deployed and will redirect to 
"Page not found" in a development setup.

Please refer to the [main WIPP repository](https://github.com/usnistgov/WIPP) to learn more about 
external tools configuration for WIPP.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### API root URL in development mode

Modify the environment property `apiRootUrl` in the `environment.ts` file from `apiRootUrl: 'http://localhost:8080/api'`
to `apiRootUrl: 'http://*IP_ADDRESS*:8080/api'` (`*IP_ADDRESS*` being the IP address of your machine).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deployment
1. Create a `.env` file in the root of the repository, using `sample-env` as an example.
1. Configure `kubectl` with a `kubeconfig` pointing to the correct Kubernetes cluster. Optionally, pass the location of the `kubeconfig` file in the `.env`. This value defaults to the standard `kubeconfig` location. 
1. Run the script using: `./deploy.sh`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## WIPP Development flow
We are following the [Gitflow branching model](https://nvie.com/posts/a-successful-git-branching-model/) for the WIPP development.  

### Contributing
Please follow the [Contributing guidelines](CONTRIBUTING.md)

## Disclaimer

[NIST Disclaimer](LICENSE.md)
