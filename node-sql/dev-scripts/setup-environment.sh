#!/bin/bash
set -e

SCRIPT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=`dirname $SCRIPT_ROOT`

(
    cd $PROJECT_ROOT

    npx concurrently \
        "npm install" \
        "./dev-scripts/destroy-environment.sh && docker-compose up -d"
)