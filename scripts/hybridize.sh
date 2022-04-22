#!/bin/sh

DIST=./dist
ESM=${DIST}/esm
CJS=${DIST}/cjs

PKGJSON='{"main":"index.cjs.js","module":"index.esm.js","types":"index.d.ts","sideEffects":false}'

mv ${ESM}/index.d.ts ${DIST}/ &&
mv ${ESM}/index.js ${DIST}/index.esm.js &&
mv ${CJS}/index.js ${DIST}/index.cjs.js &&

find ${ESM} -name '*.js' -type f |
while read path; do
    file=${path#${ESM}/} &&
    module=${file%.js} &&
    mkdir -p ${DIST}/${module} &&
    mv ${ESM}/${module}.d.ts ${DIST}/${module}/index.d.ts &&
    mv ${ESM}/${file} ${DIST}/${module}/index.esm.js &&
    mv ${CJS}/${file} ${DIST}/${module}/index.cjs.js &&
    echo ${PKGJSON} > ${DIST}/${module}/package.json ||
    exit 1
done &&

rm -rf ${ESM} ${CJS}
