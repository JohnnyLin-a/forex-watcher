#!/bin/bash
docker run --rm -it -v $PWD:/src -w /src --network host node:18-alpine sh