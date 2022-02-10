#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CHANGE_SET_NAME="${SERVICE_NAME}-app-${VERSION}"

_CHANGE_SET_TYPE=UPDATE
if [ "$CHANGE_SET_TYPE" = "CREATE" ]; then
  _CHANGE_SET_TYPE=CREATE
fi

aws cloudformation --output json \
  create-change-set \
  --stack-name ${SERVICE_NAME}-app \
  --change-set-name $CHANGE_SET_NAME \
  --change-set-type $_CHANGE_SET_TYPE \
  --template-body file://../cloudformation/Service.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=ServiceName,ParameterValue=$SERVICE_NAME \
    ParameterKey=ProjectPhase,ParameterValue=$PROJECT_PHASE \
    ParameterKey=Version,ParameterValue=$VERSION \
    ParameterKey=DnsZoneName,ParameterValue=$DNS_ZONE_NAME \
    ParameterKey=DnsName,ParameterValue=$DNS_NAME >/dev/null

echo
echo Change set created: $CHANGE_SET_NAME
echo
