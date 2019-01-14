#!/usr/bin/env bash

set -o errexit
set -o pipefail

npx lerna publish from-git --yes
