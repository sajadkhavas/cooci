#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

DEPLOY_ROOT=${FRONTEND_DEPLOY_ROOT:-/var/www/winimi/frontend}
SERVICE_FILE=${FRONTEND_SERVICE_FILE:-/etc/systemd/system/winimi-frontend.service}
RUNTIME_ENV=${FRONTEND_RUNTIME_ENV:-/etc/winimi/frontend-runtime.env}
NGINX_SITE=${FRONTEND_NGINX_SITE:-/etc/nginx/sites-enabled/winimi-frontend.conf}
MIN_FREE_KIB=${FRONTEND_MIN_FREE_KIB:-2097152}
TEST_MODE=${WINIMI_PREFLIGHT_TEST_MODE:-false}

errors=()
notes=()

require_command() {
  command -v "$1" >/dev/null 2>&1 || errors+=("missing command: $1")
}

for command in node nginx curl openssl realpath df awk grep stat; do
  require_command "$command"
done

if command -v node >/dev/null 2>&1; then
  node_major=$(node -p 'process.versions.node.split(".")[0]')
  [[ "$node_major" == "22" ]] || errors+=("Node.js major must be 22, found $node_major")
fi

if [[ "$TEST_MODE" != "true" ]]; then
  id winimi >/dev/null 2>&1 || errors+=("system user winimi is missing")
  getent group www-data >/dev/null 2>&1 || errors+=("group www-data is missing")
  [[ -f "$SERVICE_FILE" ]] || errors+=("systemd unit is missing: $SERVICE_FILE")
  [[ -f "$RUNTIME_ENV" ]] || errors+=("runtime environment is missing: $RUNTIME_ENV")
  [[ -f "$NGINX_SITE" ]] || errors+=("Nginx site is missing: $NGINX_SITE")
  [[ -d "$DEPLOY_ROOT/releases" ]] || errors+=("release directory is missing: $DEPLOY_ROOT/releases")

  if [[ -f "$RUNTIME_ENV" ]]; then
    mode=$(stat -c '%a' "$RUNTIME_ENV")
    [[ "$mode" == "640" || "$mode" == "600" ]] || errors+=("runtime env mode must be 0640 or 0600, found $mode")
    grep -qx 'HOST=127.0.0.1' "$RUNTIME_ENV" || errors+=("runtime must bind HOST=127.0.0.1")
    grep -qx 'PORT=4173' "$RUNTIME_ENV" || errors+=("runtime must use PORT=4173")
    grep -qx 'NODE_ENV=production' "$RUNTIME_ENV" || errors+=("runtime must set NODE_ENV=production")
    grep -qx 'WINIMI_API_ORIGIN=https://api.winimibakery.com' "$RUNTIME_ENV" || errors+=("runtime API origin is invalid")
    if grep -Eqi '(^|_)(APP_KEY|DB_PASSWORD|MERCHANT|KAVENEGAR|SMS_API_KEY|ENAMAD)' "$RUNTIME_ENV"; then
      errors+=("frontend runtime env contains a backend secret-shaped variable")
    fi
  fi

  nginx -t >/dev/null 2>&1 || errors+=("nginx -t failed")
  systemd-analyze verify "$SERVICE_FILE" >/dev/null 2>&1 || errors+=("systemd unit verification failed")
fi

mkdir -p "$DEPLOY_ROOT" 2>/dev/null || true
free_kib=$(df -Pk "$DEPLOY_ROOT" 2>/dev/null | awk 'NR==2 {print $4}')
if [[ -n "${free_kib:-}" && "$free_kib" =~ ^[0-9]+$ ]]; then
  (( free_kib >= MIN_FREE_KIB )) || errors+=("less than ${MIN_FREE_KIB} KiB free at $DEPLOY_ROOT")
else
  notes+=("disk capacity could not be measured for $DEPLOY_ROOT")
fi

if ((${#errors[@]})); then
  printf 'Frontend production preflight failed with %d issue(s):\n' "${#errors[@]}" >&2
  printf -- '- %s\n' "${errors[@]}" >&2
  exit 1
fi

printf 'Frontend production preflight passed.\n'
if ((${#notes[@]})); then
  printf -- '- note: %s\n' "${notes[@]}"
fi
