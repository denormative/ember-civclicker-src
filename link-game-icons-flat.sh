#!/bin/bash

rm -rf vendor/icons-flat
mkdir vendor/icons-flat
cd vendor/icons-flat

for i in $(find ../game-icons/ -name '*.svg');
do
    if [ ! -f $(basename $i) ]; then
        ln -s $i $(basename $i)
    elif [ ! -f b-$(basename $i) ]; then
        ln -s $i b-$(basename $i)
    elif [ ! -f c-$(basename $i) ]; then
        ln -s $i c-$(basename $i)
    fi
done
