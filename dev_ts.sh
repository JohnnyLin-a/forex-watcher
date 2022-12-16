#!/bin/bash
docker run --name dev-forex-watcher --rm -d --entrypoint "tail" -v $PWD:/src -w /src node:18-bullseye-slim "-f" "/dev/null"