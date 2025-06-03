#!/bin/bash

cd Frontend
npx tsc
cp -r src/css build/
cp -r src/html build/ 
cd ..

