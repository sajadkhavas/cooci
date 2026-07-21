#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

DEPLOY_ROOT=${1:-/var/www/winimi/frontend}
REQUESTED_RELEASE=${2:-}

if [[ ! -L "$DEPLOY_ROOT/current" ]]; then
  echo "Current frontend release symlink is missing: $DEPLOY_ROOT/current" >&2
  exit 1
fi

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
node "$(dirname "$0")/../../scripts/verify-frontend-release.mjs" "$TARGET_DIR"

ln -s "releases/$target" "$DEPLOY_ROOT/.current.$$.new"
mv -Tf "$DEPLOY_ROOT/.current.$$.new" "$DEPLOY_ROOT/current"
printf '%s\n' "$target" > "$DEPLOY_ROOT/active-release"

echo "Rolled frontend back from $current to $target."
