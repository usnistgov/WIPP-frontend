#!/bin/sh
if [ $# -ne 6 ]
then
  echo "Illegal number of parameters. Exiting..."
  echo "Command: ./entrypoint.sh \${backend_host} \${backend_port} \${jupyter_host} \${jupyter_port} \${visionui_host} \${visionui_port}"
  exit 1
fi

BACKEND_HOST=$1
BACKEND_PORT=$2
JUPYTER_HOST=$3
JUPYTER_PORT=$4
VISIONUI_HOST=$5
VISIONUI_PORT=$6

sed -i \
  -e 's/@backend_host@/'"${BACKEND_HOST}"'/' \
  -e 's/@backend_port@/'"${BACKEND_PORT}"'/' \
  -e 's/@jupyter_host@/'"${JUPYTER_HOST}"'/' \
  -e 's/@jupyter_port@/'"${JUPYTER_PORT}"'/' \
  -e 's/@visionui_host@/'"${VISIONUI_HOST}"'/' \
  -e 's/@visionui_port@/'"${VISIONUI_PORT}"'/' \
  
  /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
