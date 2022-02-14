#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

CS_VERSION=$(echo -n "$VERSION" | tr '_' '-')
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

cs-report() {
  aws cloudformation --output $1 \
    describe-change-set \
    --change-set-name $CHANGE_SET_NAME \
    --stack-name ${SERVICE_NAME}-ecr
}

cs-status() {
  cs-report json | jq ".Status"
}

STACK_STATUS=`cs-status`
WAIT_COUNT=0
while [ "$STACK_STATUS" = '"CREATE_IN_PROGRESS"' ]; do
  if [ $WAIT_COUNT -gt 6 ]; then
    echo "Wait timeout" 1>&2
    exit 1
  fi

  echo "Change set in $STACK_STATUS; waiting"
  sleep 10
  STACK_STATUS=`cs-status`
  WAIT_COUNT=$((WAIT_COUNT + 1))
done

if [ "$STACK_STATUS" = '"CREATE_COMPLETE"' ]; then
  cs-report table
else
  echo "Change set in $STACK_STATUS" 1>&2
  exit 1
fi
