#!/bin/bash
docker run --rm -d --name "forex-watcher" -w /dist --env-file postgres.env --env-file .env --network=host forex-watcher:latest