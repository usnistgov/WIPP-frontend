# WIPPFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

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

We provide a sample configuration file `sample-config.json` at the root of this repository defining
a default configuration for the Argo Dashboard URL at `localhost:30501` (sample argo-ui service patch 
to achieve this configuration available 
[here](https://github.com/usnistgov/WIPP-deploy/blob/develop/deployment/argo-service-patch.yaml)).   
This sample configuration file assumes that the other tools are not deployed and will redirect to 
"Page not found" in a development setup.

Please refer to the [main WIPP repository](https://github.com/usnistgov/WIPP-deploy) to learn more about 
external tools configuration for WIPP.

#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### API root URL in development mode

Modify the environment property `apiRootUrl` in the `environment.ts` file from `apiRootUrl: 'http://localhost:8080/api'`
to `apiRootUrl: 'http://ACTUAL_IP_ADDRESS:8080/api'` (this is temporary fix when running backend and frontend outside of Kubernetes).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contributions

This repository is using the `git-flow` publishing model. Please refer to [https://danielkummer.github.io/git-flow-cheatsheet/](https://danielkummer.github.io/git-flow-cheatsheet/) for more information.

#### Branching model
* Main branches: master (for releases only), develop (development branch)
* One branch per feature/bug fix, linked to a Gitlab issue
* One branch per release/hotfix

#### Start a new feature/bug fix

* The process should start with a Gitlab issue, we should be part of a milestone (target release version). Assign the issue to yourself.
* From the develop branch.

```shell
 git flow feature start branch
```
branch should mention the issue number and a short description, ie issue123-my-feature.

Work on the feature, commit and push as needed.

Once feature is done, create a Merge request (choosing to merge into the develop branch instead of master) from Gitlab and tag another developer in the comments for code review.
After the code review and optional changes are made, accept and close the merge request (removing the release remote branch). Tag the issue in the merge commit message, for example "closes #12345" and close the issue.
