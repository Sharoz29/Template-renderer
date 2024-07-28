#!/bin/bash
set -e

tagVersion=$1

if [ -z "$tagVersion" ]; then
  tagVersion="latest"
fi

docker build -t ansaries/lcs-reports:1.0.$tagVersion .
docker push ansaries/lcs-reports:1.0.$tagVersion


sed "s~lcs-reports:latest~lcs-reports:1.0.${tagVersion}~"  k8s.yaml > k8s_deploy.yaml

kubectl apply -f ./k8s_deploy.yaml -n pega23

docker delete image ansaries/lcs-reports:1.0.$tagVersion