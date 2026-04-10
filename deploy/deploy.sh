#!/bin/bash
set -e

DEPLOY_DIR=/var/www/client

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Building..."
npm run build

echo "==> Deploying to $DEPLOY_DIR..."
sudo mkdir -p "$DEPLOY_DIR"
sudo rm -rf "$DEPLOY_DIR"/*
sudo cp -r dist/* "$DEPLOY_DIR/"

echo "==> Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Done."
