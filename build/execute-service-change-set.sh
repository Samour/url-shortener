#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CS_VERSION=$(echo -n "$VERSION" | tr '_' '-')
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

aws cloudformation --output json \
  execute-change-set \
  --change-set-name $CHANGE_SET_NAME \
  --stack-name ${SERVICE_NAME}-app \
  --no-disable-rollback > /dev/null

echo
echo Change set execution started: $CHANGE_SET_NAME
echo
