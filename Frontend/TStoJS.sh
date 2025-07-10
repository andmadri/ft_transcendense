#!/bin/bash

cd Frontend/src/ts
npx tsc
cd ../..

cd ../Backend/
mkdir -p build/js

cp -r ../Frontend/src/css ./build/
cp -r ../Frontend/src/html ./build/
