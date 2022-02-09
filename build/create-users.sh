#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CHANGE_SET_TS=$(date +%FT%H-%M-%S)
CHANGE_SET_NAME="${SERVICE_NAME}-users-${CHANGE_SET_TS}"

_CHANGE_SET_TYPE=UPDATE
if [ "$CHANGE_SET_TYPE" = "CREATE" ]; then
  _CHANGE_SET_TYPE=CREATE
fi

aws cloudformation --output json \
  create-change-set \
  --stack-name ${SERVICE_NAME}-users \
  --change-set-name $CHANGE_SET_NAME \
  --change-set-type $_CHANGE_SET_TYPE \
  --template-body file://../cloudformation/Users.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=ServiceName,ParameterValue=$SERVICE_NAME \
    ParameterKey=ProjectPhase,ParameterValue=$PROJECT_PHASE >/dev/null

echo Change set created: $CHANGE_SET_NAME
