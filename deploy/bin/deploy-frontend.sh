#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

RELEASE_SOURCE=${1:-}
DEPLOY_ROOT=${2:-/var/www/winimi/frontend}
KEEP_RELEASES=${KEEP_RELEASES:-5}

if [[ -z "$RELEASE_SOURCE" ]]; then
  echo "Usage: deploy-frontend.sh <verified-release-directory> [deploy-root]" >&2
  exit 64
fi
if [[ ! "$KEEP_RELEASES" =~ ^[2-9][0-9]*$ ]]; then
  echo "KEEP_RELEASES must be an integer of at least 2." >&2
  exit 64
fi

RELEASE_SOURCE=$(realpath "$RELEASE_SOURCE")
node "$(dirname "$0")/../../scripts/verify-frontend-release.mjs" "$RELEASE_SOURCE"
RELEASE_ID=$(node -e 'const fs=require("fs");const p=process.argv[1];process.stdout.write(JSON.parse(fs.readFileSync(p,"utf8")).releaseId)' "$RELEASE_SOURCE/release-manifest.json")

mkdir -p "$DEPLOY_ROOT/releases"
TARGET="$DEPLOY_ROOT/releases/$RELEASE_ID"
STAGING="$DEPLOY_ROOT/releases/.${RELEASE_ID}.staging.$$"

if [[ -e "$TARGET" ]]; then
  node "$(dirname "$0")/../../scripts/verify-frontend-release.mjs" "$TARGET"
else
  trap 'rm -rf "$STAGING"' EXIT
  mkdir -p "$STAGING"
  cp -a "$RELEASE_SOURCE/." "$STAGING/"
  node "$(dirname "$0")/../../scripts/verify-frontend-release.mjs" "$STAGING"
  mv "$STAGING" "$TARGET"
  trap - EXIT
fi

ln -s "releases/$RELEASE_ID" "$DEPLOY_ROOT/.current.$$.new"
mv -Tf "$DEPLOY_ROOT/.current.$$.new" "$DEPLOY_ROOT/current"
printf '%s\n' "$RELEASE_ID" > "$DEPLOY_ROOT/active-release"

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

echo "Activated frontend release $RELEASE_ID at $DEPLOY_ROOT/current."
