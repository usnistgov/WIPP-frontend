FROM nginx:1.17-alpine
MAINTAINER National Institute of Standards and Technology

ARG WIPP_FRONTEND="WIPP-frontend"

COPY VERSION /VERSION

# Set working directory
WORKDIR /var/www/

# Copy WIPP frontend application
COPY ${WIPP_FRONTEND}.tar.gz .
RUN tar -xvzf ${WIPP_FRONTEND}.tar.gz \
  && mv ${WIPP_FRONTEND} frontend

# Copy WIPP frontend config
COPY config.json frontend/assets/config/config.json

# Copy nginx configuration and entrypoint script
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
