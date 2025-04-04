#!/bin/bash

set -e

cd "$(dirname "$0")"

format_rdf() {
  rapper -i turtle -o turtle -q $1 >temp.ttl
  mv -f temp.ttl $1
}

format_rdf $PWD/models.shaclmate.ttl
format_rdf $PWD/stubs.shaclmate.ttl

../../../../shaclmate/packages/cli/dist/cli.js generate $PWD/models.shaclmate.ttl $PWD/stubs.shaclmate.ttl  >$PWD/generated.ts

npm exec biome -- check --write --unsafe $PWD/generated.ts
