#!/bin/bash
set -e

tagVersion=$1

if [ -z "$tagVersion" ]; then
  tagVersion="latest"
fi

docker build -t ansaries/lcs-reports:1.0.$tagVersion .
docker push ansaries/lcs-reports:1.0.$tagVersion


sed "s~lcs-reports:latest~lcs-reports:1.0.${tagVersion}~"  k8s.yaml > k8s_deploy.yaml
sed "s~lcs-reports:latest~lcs-reports:1.0.${tagVersion}~"  k8s24.yaml > k8s24_deploy.yaml

kubectl apply -f ./k8s_deploy.yaml -n pega23
kubectl apply -f ./k8s24_deploy.yaml -n pega24

docker rmi ansaries/lcs-reports:1.0.$tagVersion
docker image prune -f