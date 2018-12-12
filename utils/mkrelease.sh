#!/usr/bin/env bash

git pull
git tag "release@$(date -u +%Y%m%d-%H%M)"
git push --follow-tags
