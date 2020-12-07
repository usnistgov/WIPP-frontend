#!/usr/bin/env bash

export $(egrep -v '^#' .env)

# Backup file extension required to support Mac versions of sed
sed -i.bak \
    -e "s/FRONTEND_VERSION_VALUE/${DOCKER_VERSION}/g" \
    -e "s|JUPYTERHUB_URL_VALUE|${JUPYTERHUB_URL}|g" \
    -e "s|VISION_URL_VALUE|${VISION_URL}|g" \
    -e "s|ARGO_URL_VALUE|${ARGO_URL}|g" \
    -e "s|CATALOG_URL_VALUE|${CATALOG_URL}|g" \
    deploy/kubernetes/frontend-deployment.yaml
rm deploy/kubernetes/frontend-deployment.yaml.bak

sed -i.bak \
    -e "s|FRONTEND_HOST_NAME_VALUE|${FRONTEND_HOST_NAME}|g" \
    deploy/kubernetes/ingress.yaml
rm deploy/kubernetes/ingress.yaml.bak

kubectl apply --kubeconfig=${KUBECONFIG} -f deploy/kubernetes/frontend-deployment.yaml
kubectl apply --kubeconfig=${KUBECONFIG} -f deploy/kubernetes/services.yaml
kubectl apply --kubeconfig=${KUBECONFIG} -f deploy/kubernetes/ingress.yaml
