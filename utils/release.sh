#!/usr/bin/env bash

# Authorise npm for publishing
cat <<NPMRC >> ~/.npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
NPMRC

# Publish!
npx lerna publish from-git --yes
