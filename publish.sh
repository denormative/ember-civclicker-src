#!/bin/bash

rm -r dist/*
ember build --prod
rsync -av --delete --exclude=.git dist/ site
cd site
git add **/*
git commit -a -m $(date "+%Y-%m-%d")
cd ..
git commit -a -m $(date "+%Y-%m-%d")
git push --recurse-submodules=on-demand
