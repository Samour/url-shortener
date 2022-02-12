#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CS_VERSION=$(echo -n "$VERSION" | tr '_' '-')
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

_VERSION="$VERSION"
if [ ! -z "$DEPLOY_VERSION" ] && [ "$DEPLOY_VERSION" != "latest" ]; then
  _VERSION="$DEPLOY_VERSION"
fi

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
  --parameters ParameterKey=ServiceName,ParameterValue="$SERVICE_NAME" \
    ParameterKey=ProjectPhase,ParameterValue="$PROJECT_PHASE" \
    ParameterKey=Version,ParameterValue="$_VERSION" \
    ParameterKey=DnsZoneName,ParameterValue="$DNS_ZONE_NAME" \
    ParameterKey=ApiDnsName,ParameterValue="$API_DNS_NAME" \
    ParameterKey=FEDnsName,ParameterValue="$FE_DNS_NAME" \
    ParameterKey=ACMHostedZoneId,ParameterValue="$ACM_HOSTED_ZONE_ID" \
    ParameterKey=CFCertificateArn,ParameterValue="$CF_CERTIFICATE_ARN" >/dev/null

echo
echo Change set created: $CHANGE_SET_NAME
echo
