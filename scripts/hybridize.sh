#!/bin/sh

DIST=./dist
ESM=esm
CJS=lib # TODO: change to "cjs" on v0.2.0.

mv "${DIST}/${ESM}/index.d.ts" "${DIST}/" &&

find "${DIST}/${ESM}" -name '*.js' \! -name index.js -type f |
while read path; do
    file="${path#${DIST}/${ESM}/}" &&
    module="${file%.js}" &&
    mkdir -p "${DIST}/${module}" &&
    # Help auto import of files from project root
    # (es., `import { curry } from 'fortepiano/function'`).
    mv "${DIST}/${ESM}/${module}.d.ts" "${DIST}/${module}.d.ts" &&
    relative_prefix="$(echo "${module}" | sed -E 's,[^/]+,..,g')" &&
    # Create proxy modules to shadow ESM and CJS modules.
    cat <<EOF >"${DIST}/${module}/package.json" ||
{
  "main": "${relative_prefix}/${CJS}/${module}.js",
  "module": "${relative_prefix}/${ESM}/${module}.js",
  "types": "${relative_prefix}/${module}.d.ts",
  "sideEffects": false
}
EOF
    exit 1
done
