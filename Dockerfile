FROM node:9.6.1

EXPOSE 4200

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ARG BUILD_VERSION

ARG ARTIFACTORY_USER

ARG ARTIFACTORY_TOKEN

RUN curl -u${ARTIFACTORY_USER}:${ARTIFACTORY_TOKEN} -O https://builds.aws.labshare.org/artifactory/labshare/WIPP-frontend/${BUILD_VERSION}.tar.gz

RUN tar -xvf ${BUILD_VERSION}.tar.gz -C /usr/src/app/

RUN rm -rf ${BUILD_VERSION}.tar.gz

CMD ["ng", "serve --prod --host 0.0.0.0"]
