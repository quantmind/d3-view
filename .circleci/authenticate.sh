#!/usr/bin/env bash

git config --global user.email "bot@quantmind.com"
git config --global user.username "qmbot"
git config --global user.name "Quantmind Bot"
cd && git clone git@github.com:quantmind/giottojs.org.git
cd && echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
