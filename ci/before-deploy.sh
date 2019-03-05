#!/usr/bin/env bash

set -o errexit
set -o pipefail

# Authorise npm for publishing
cat <<NPMRC >> ~/.npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
NPMRC

# Debug: show current diff. If there are any changes Lerna will refuse to perform a release. ⚠️
git diff
