#!/bin/bash

set -e
cd "${0%/*}"

. ./VARS

source utils/change-set.sh

STACK_STATUS=`cs-status`

if [ "$STACK_STATUS" = '"CREATE_COMPLETE"' ]; then
  cs-report table
else
  echo "Change set in $STACK_STATUS" 1>&2
  exit 1
fi
