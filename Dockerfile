
FROM node:9.6.1

EXPOSE 4200

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install
RUN npm install -g @angular/cli

CMD ng serve --prod --host 0.0.0.0