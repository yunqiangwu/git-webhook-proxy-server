#!/usr/bin/env bash
CI_COMMIT_SHA=${1}
APP_NAME=${2}
IMAGES_TAG=${3}
export CI_COMMIT_SHA=${CI_COMMIT_SHA}
export APP_NAME=${APP_NAME}
export IMAGES_TAG=${IMAGES_TAG}
rm -rf .generated
mkdir -p .generated
for f in $(find -name "*.yml")
do
 echo $f
 envsubst < $f > ".generated/$(basename $f)"
done