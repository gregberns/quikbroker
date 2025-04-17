#!/bin/bash

echo "[DEBUG] Environment: $DEPLOY_ENV"

yarn migrate
