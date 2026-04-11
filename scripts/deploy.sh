#!/bin/bash
set -e

if ! command -v railway &> /dev/null; then
  echo "ERROR: Railway CLI not installed."
  echo "Run: npm install -g @railway/cli"
  exit 1
fi

if ! railway status &> /dev/null; then
  echo "ERROR: Project not linked to Railway."
  echo "Run: railway link"
  echo "See DEPLOYMENT_SETUP.md for one-time setup."
  exit 1
fi

echo "Deploying cvc-web to Railway..."
railway up --detach
echo "Deployment triggered. Monitor at: https://railway.app/dashboard"
