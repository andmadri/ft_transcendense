#!/bin/bash

cd Frontend/src/ts
npx tsc
cd ../..

cp -r src/css build/
cp -r src/html build/
cp -r build ../Server/
cd ..

