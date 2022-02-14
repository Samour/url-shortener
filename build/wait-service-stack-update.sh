#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

source utils/change-set.sh

stack-status() {
  aws cloudformation --output json \
    describe-stacks \
    --stack-name ${SERVICE_NAME}-app \
    | jq ".Stacks[0].StackStatus"
}

STACK_STATUS=`stack-status`
WAIT_COUNT=0
while [ "$STACK_STATUS" != '"UPDATE_COMPLETE"' ] && \
  [ "$STACK_STATUS" != '"UPDATE_FAILED"' ] && \
  [ "$STACK_STATUS" != '"UPDATE_ROLLBACK_COMPLETE"' ] && \
  [ "$STACK_STATUS" != '"UPDATE_ROLLBACK_FAILED"' ] && \
  [ "$STACK_STATUS" != '"ROLLBACK_COMPLETE"' ] && \
  [ "$STACK_STATUS" != '"ROLLBACK_FAILED"' ]; do
  if [ $WAIT_COUNT -gt 90 ]; then
    echo "Wait timeout" 1>&2
    exit 1
  fi

  echo "Stack in $STACK_STATUS"
  STACK_STATUS=`stack-status`
  WAIT_COUNT=$((WAIT_COUNT + 1))
  sleep 10
done

if [ "$STACK_STATUS" = '"UPDATE_COMPLETE"' ]; then
  echo "Stack in $STACK_STATUS"
else
  echo "Stack in $STACK_STATUS" 1>&2
  exit 1
fi
