#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

RELEASE_SOURCE=${1:-}
DEPLOY_ROOT=${2:-/var/www/winimi/frontend}
SERVICE_NAME=${FRONTEND_SERVICE_NAME:-winimi-frontend.service}
HEALTH_URL=${FRONTEND_INTERNAL_HEALTH_URL:-http://127.0.0.1:4173/__ssr_health}

if [[ -z "$RELEASE_SOURCE" ]]; then
  echo "Usage: deploy-production-frontend.sh <verified-release-directory> [deploy-root]" >&2
  exit 64
fi

for command in node curl realpath systemctl sudo; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is missing: $command" >&2
    exit 69
  }
done

systemctl cat "$SERVICE_NAME" >/dev/null

export FRONTEND_RESTART_COMMAND="sudo systemctl restart $SERVICE_NAME"
export FRONTEND_HEALTH_URL="$HEALTH_URL"

SCRIPT_ROOT=$(cd "$(dirname "$0")/../.." && pwd)
bash "$SCRIPT_ROOT/deploy/bin/deploy-frontend.sh" "$RELEASE_SOURCE" "$DEPLOY_ROOT"

sudo systemctl is-active --quiet "$SERVICE_NAME"
curl --fail --silent --show-error --retry 20 --retry-delay 1 --retry-connrefused --connect-timeout 2 --max-time 10 "$HEALTH_URL" >/dev/null

echo "Production frontend deployment is active and healthy."
