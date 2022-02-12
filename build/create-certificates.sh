#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CHANGE_SET_TS=$(date -u +%FT%H-%M-%S)
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

_CHANGE_SET_TYPE=UPDATE
if [ "$CHANGE_SET_TYPE" = "CREATE" ]; then
  _CHANGE_SET_TYPE=CREATE
fi

aws cloudformation --output json \
  --region us-east-1 \
  create-change-set \
  --stack-name ${SERVICE_NAME}-certificates \
  --change-set-name $CHANGE_SET_NAME \
  --change-set-type $_CHANGE_SET_TYPE \
  --template-body file://../cloudformation/Certificates.yaml \
  --parameters ParameterKey=ServiceName,ParameterValue="$SERVICE_NAME" \
    ParameterKey=ProjectPhase,ParameterValue="$PROJECT_PHASE" \
    ParameterKey=FEDnsName,ParameterValue="$FE_DNS_NAME" \
    ParameterKey=ACMHostedZoneId,ParameterValue="$ACM_HOSTED_ZONE_ID" > /dev/null

echo
echo Change set created: $CHANGE_SET_NAME
echo
