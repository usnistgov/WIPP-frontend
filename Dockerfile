FROM nginx:1.14.0
MAINTAINER National Institute of Standards and Technology

ARG WIPP_FRONTEND="WIPP-frontend"

# Set working directory
WORKDIR /var/www/

# Copy WIPP frontend application
COPY dist/${WIPP_FRONTEND}.tar.gz .
RUN tar -xvzf ${WIPP_FRONTEND}.tar.gz \
  && mv ${WIPP_FRONTEND} frontend

# Copy nginx configuration and entrypoint script
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
