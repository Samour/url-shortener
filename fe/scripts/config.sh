#!/bin/bash

if [ -z "$TARGET_ENV" ]; then
  TARGET_ENV=local
fi

cp configs/config-$TARGET_ENV.json public/config.json
