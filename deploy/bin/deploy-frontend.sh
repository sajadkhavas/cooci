#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

RELEASE_SOURCE=${1:-}
DEPLOY_ROOT=${2:-/var/www/winimi/frontend}
KEEP_RELEASES=${KEEP_RELEASES:-5}
FRONTEND_RESTART_COMMAND=${FRONTEND_RESTART_COMMAND:-}
FRONTEND_HEALTH_URL=${FRONTEND_HEALTH_URL:-}

if [[ -z "$RELEASE_SOURCE" ]]; then
  echo "Usage: deploy-frontend.sh <verified-release-directory> [deploy-root]" >&2
  exit 64
fi
if [[ ! "$KEEP_RELEASES" =~ ^[2-9][0-9]*$ ]]; then
  echo "KEEP_RELEASES must be an integer of at least 2." >&2
  exit 64
fi

SCRIPT_ROOT=$(cd "$(dirname "$0")/../.." && pwd)
RELEASE_SOURCE=$(realpath "$RELEASE_SOURCE")
node "$SCRIPT_ROOT/scripts/verify-frontend-release.mjs" "$RELEASE_SOURCE"
RELEASE_ID=$(node -e 'const fs=require("fs");const p=process.argv[1];process.stdout.write(JSON.parse(fs.readFileSync(p,"utf8")).releaseId)' "$RELEASE_SOURCE/release-manifest.json")

mkdir -p "$DEPLOY_ROOT/releases"
chmod 0755 "$DEPLOY_ROOT" "$DEPLOY_ROOT/releases"
TARGET="$DEPLOY_ROOT/releases/$RELEASE_ID"
STAGING="$DEPLOY_ROOT/releases/.${RELEASE_ID}.staging.$$"
PREVIOUS_TARGET=""
if [[ -L "$DEPLOY_ROOT/current" ]]; then
  PREVIOUS_TARGET=$(readlink "$DEPLOY_ROOT/current")
fi

if [[ -e "$TARGET" ]]; then
  node "$SCRIPT_ROOT/scripts/verify-frontend-release.mjs" "$TARGET"
else
  trap 'rm -rf "$STAGING"' EXIT
  mkdir -p "$STAGING"
  cp -a "$RELEASE_SOURCE/." "$STAGING/"
  node "$SCRIPT_ROOT/scripts/verify-frontend-release.mjs" "$STAGING"
  chmod -R u=rwX,go=rX "$STAGING"
  mv "$STAGING" "$TARGET"
  trap - EXIT
fi
chmod -R u=rwX,go=rX "$TARGET"

activate_release() {
  local target=$1
  ln -s "$target" "$DEPLOY_ROOT/.current.$$.new"
  mv -Tf "$DEPLOY_ROOT/.current.$$.new" "$DEPLOY_ROOT/current"
}
restart_runtime() {
  if [[ -n "$FRONTEND_RESTART_COMMAND" ]]; then
    FRONTEND_CURRENT="$DEPLOY_ROOT/current" bash -Eeuo pipefail -c "$FRONTEND_RESTART_COMMAND"
  fi
}
check_health() {
  if [[ -n "$FRONTEND_HEALTH_URL" ]]; then
    curl --fail --silent --show-error --retry 20 --retry-delay 1 "$FRONTEND_HEALTH_URL" >/dev/null
  fi
}

activate_release "releases/$RELEASE_ID"
if ! restart_runtime || ! check_health; then
  echo "SSR runtime restart or health check failed; restoring previous release." >&2
  if [[ -n "$PREVIOUS_TARGET" ]]; then
    activate_release "$PREVIOUS_TARGET"
    restart_runtime || true
  fi
  exit 1
fi
printf '%s\n' "$RELEASE_ID" > "$DEPLOY_ROOT/active-release"
chmod 0644 "$DEPLOY_ROOT/active-release"

mapfile -t releases < <(find "$DEPLOY_ROOT/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %f\n' | sort -nr | awk '{print $2}')
active=$(basename "$(readlink -f "$DEPLOY_ROOT/current")")
kept=0
for release in "${releases[@]}"; do
  if [[ "$release" == "$active" ]]; then
    continue
  fi
  kept=$((kept + 1))
  if (( kept >= KEEP_RELEASES )); then
    rm -rf -- "$DEPLOY_ROOT/releases/$release"
  fi
done

echo "Activated SSR frontend release $RELEASE_ID at $DEPLOY_ROOT/current."
