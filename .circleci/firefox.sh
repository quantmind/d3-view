#!/usr/bin/env bash

apt-get update && sudo apt-get install libpango1.0-0 && sudo apt-get install firefox
ln -sf /usr/lib/firefox/firefox /usr/bin/firefox
