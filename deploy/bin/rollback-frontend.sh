#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

DEPLOY_ROOT=${1:-/var/www/winimi/frontend}
REQUESTED_RELEASE=${2:-}
FRONTEND_RESTART_COMMAND=${FRONTEND_RESTART_COMMAND:-}
FRONTEND_HEALTH_URL=${FRONTEND_HEALTH_URL:-}

if [[ ! -L "$DEPLOY_ROOT/current" ]]; then
  echo "Current frontend release symlink is missing: $DEPLOY_ROOT/current" >&2
  exit 1
fi

SCRIPT_ROOT=$(cd "$(dirname "$0")/../.." && pwd)
current=$(basename "$(readlink -f "$DEPLOY_ROOT/current")")
if [[ -n "$REQUESTED_RELEASE" ]]; then
  target="$REQUESTED_RELEASE"
else
  mapfile -t candidates < <(
    find "$DEPLOY_ROOT/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %f\n' |
      sort -nr |
      awk -v current="$current" '$2 != current { print $2 }'
  )
  target=${candidates[0]:-}
fi

if [[ -z "$target" ]]; then
  echo "No previous frontend release is available for rollback." >&2
  exit 1
fi
if [[ ! "$target" =~ ^[a-f0-9]{20}$ ]]; then
  echo "Rollback release ID is invalid: $target" >&2
  exit 64
fi

TARGET_DIR="$DEPLOY_ROOT/releases/$target"
node "$SCRIPT_ROOT/scripts/verify-frontend-release.mjs" "$TARGET_DIR"

activate_release() {
  local release=$1
  ln -s "releases/$release" "$DEPLOY_ROOT/.current.$$.new"
  mv -Tf "$DEPLOY_ROOT/.current.$$.new" "$DEPLOY_ROOT/current"
}
restart_runtime() {
  if [[ -n "$FRONTEND_RESTART_COMMAND" ]]; then
    FRONTEND_CURRENT="$DEPLOY_ROOT/current" bash -Eeuo pipefail -c "$FRONTEND_RESTART_COMMAND"
  fi
}
check_health() {
  if [[ -n "$FRONTEND_HEALTH_URL" ]]; then
    curl --fail --silent --show-error --retry 20 --retry-delay 1 --retry-connrefused --connect-timeout 2 --max-time 10 "$FRONTEND_HEALTH_URL" >/dev/null
  fi
}

activate_release "$target"
if ! restart_runtime || ! check_health; then
  echo "Rollback runtime failed; restoring release $current." >&2
  activate_release "$current"
  restart_runtime || true
  exit 1
fi
printf '%s\n' "$target" > "$DEPLOY_ROOT/active-release"

echo "Rolled SSR frontend back from $current to $target."
