#!/bin/bash

set -e
cd "${0%/*}"

echo
echo ":: Building Jar file"
echo
./gradlew clean && ./gradlew bootJar

echo
echo ":: Building Docker image"
echo
docker build -t $SERVICE_NAME:$VERSION .

echo
echo ":: Pushing to ECR"
echo
aws ecr get-login-password | docker login --username AWS --password-stdin $DOCKER_REPO
docker tag $SERVICE_NAME:$VERSION $DOCKER_REPO:$VERSION
docker push $DOCKER_REPO:$VERSION
