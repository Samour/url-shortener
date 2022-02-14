#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

# Easier than polling AWS until changeset is ready
sleep 15

CS_VERSION=$(echo -n "$VERSION" | tr '_' '-')
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

aws cloudformation --output table \
  describe-change-set \
  --change-set-name $CHANGE_SET_NAME \
  --stack-name ${SERVICE_NAME}-app
