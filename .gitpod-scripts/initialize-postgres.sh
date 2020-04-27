#!/bin/bash

echo "CREATE DATABASE order_management" | psql
cat start/initdb/* | psql order_management
echo "CREATE DATABASE order_management_test" | psql
cat start/initdb/01-schema.sql | psql order_management_test