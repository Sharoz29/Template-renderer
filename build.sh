#!/bin/bash

# tagVersion=$1

# if [ -z "$tagVersion" ]; then
#   tagVersion="latest"
# fi

docker build -t ansaries/lcs-reports:latest .

# docker tag lcs-reports:latest ansaries/lcs-reports:1.0.$tagVersion
docker push ansaries/lcs-reports:latest
kubectl apply -f ./k8s.yaml -n pega23
