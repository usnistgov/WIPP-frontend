FROM nginx:1.17-alpine
MAINTAINER National Institute of Standards and Technology

ARG WIPP_FRONTEND="WIPP-frontend"
ARG WIPP_FRONTEND_LIB="wipp-frontend-lib"
ARG WIPP_FRONTEND_APP="wipp-frontend-app"

COPY VERSION /VERSION

# Set working directory
WORKDIR /var/www/

# Copy WIPP frontend application
COPY ${WIPP_FRONTEND}.tar.gz .
RUN tar -xvzf ${WIPP_FRONTEND}.tar.gz 
RUN pwd
RUN ls -al
#RUN mkdir frontend/frontend-app
#RUN mkdir frontend/frontend-lib
RUN mv ${WIPP_FRONTEND_APP} frontend-app && mv ${WIPP_FRONTEND_LIB} frontend-lib

# Copy WIPP frontend config
COPY config.json frontend-app/assets/config/config.json

# Copy nginx configuration and entrypoint script
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
