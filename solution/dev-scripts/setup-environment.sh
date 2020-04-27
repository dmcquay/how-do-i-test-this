#!/bin/bash

SCRIPT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=`dirname $SCRIPT_ROOT`

(
    cd $PROJECT_ROOT

    npx concurrently \
        "npm install" \
        "npm -C api install" \
        "npm -C mocks install" \
        "./dev-scripts/destroy-environment.sh && docker-compose up -d"
    
    echo "Waiting for postgres to be ready"
    docker-compose exec -T db pg_isready
    while [[ "$?" != "0" ]]
    do
        sleep 1
        docker-compose exec -T db pg_isready
    done
    echo "Postgres is ready"

    echo "Setting up test database"
    echo "CREATE DATABASE order_management_test" | docker-compose exec -T -e POSTGRES_PASSWORD=password db psql -U app postgres
    cat initdb/01-schema.sql | docker-compose exec -T -e POSTGRES_PASSWORD=password db psql -U app order_management_test
)