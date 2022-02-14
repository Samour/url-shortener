#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

source utils/change-set.sh

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
