#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

DEPLOY_ROOT=${1:-/var/www/winimi/frontend}
RELEASE_ID=${2:-}
SERVICE_NAME=${FRONTEND_SERVICE_NAME:-winimi-frontend.service}
HEALTH_URL=${FRONTEND_INTERNAL_HEALTH_URL:-http://127.0.0.1:4173/__ssr_health}

for command in node curl systemctl sudo; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is missing: $command" >&2
    exit 69
  }
done

systemctl cat "$SERVICE_NAME" >/dev/null
export FRONTEND_RESTART_COMMAND="sudo systemctl restart $SERVICE_NAME"
export FRONTEND_HEALTH_URL="$HEALTH_URL"

SCRIPT_ROOT=$(cd "$(dirname "$0")/../.." && pwd)
"$SCRIPT_ROOT/deploy/bin/rollback-frontend.sh" "$DEPLOY_ROOT" "$RELEASE_ID"

sudo systemctl is-active --quiet "$SERVICE_NAME"
curl --fail --silent --show-error --retry 20 --retry-delay 1 "$HEALTH_URL" >/dev/null

echo "Production frontend rollback is active and healthy."
