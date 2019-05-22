FROM node:9.6.1

EXPOSE 4200

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install
RUN npm install -g @angular/cli

RUN tar -cvf WIPP-frontend.tar /usr/src/app/

RUN curl -ulabshare:AP2DxpCyvU2wQpzu4KUh5nGaUTuz2NbQ1c5nbe -T /usr/src/app/WIPP-frontend.tar "https://builds.aws.labshare.org/artifactory/labshare/WIPP-frontend/"

CMD ["ng", "serve --prod --host 0.0.0.0"]
