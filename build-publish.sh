#!/bin/bash

. ./build/VARS

export VERSION=$(date +%FT%H_%M_%S)
echo VERSION=$VERSION

./be/build-publish.sh
