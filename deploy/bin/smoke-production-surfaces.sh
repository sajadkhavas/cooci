#!/usr/bin/env bash
set -Eeuo pipefail
umask 027

SITE_ORIGIN=${SITE_ORIGIN:-https://winimibakery.com}
API_ORIGIN=${API_ORIGIN:-https://api.winimibakery.com}
CURL_RESOLVE_SITE=${CURL_RESOLVE_SITE:-}
CURL_RESOLVE_API=${CURL_RESOLVE_API:-}

curl_args=(--fail --silent --show-error --location --max-time 20 --retry 3 --retry-delay 2)
[[ -z "$CURL_RESOLVE_SITE" ]] || curl_args+=(--resolve "$CURL_RESOLVE_SITE")

site_headers=$(mktemp)
site_body=$(mktemp)
api_body=$(mktemp)
trap 'rm -f "$site_headers" "$site_body" "$api_body"' EXIT

curl "${curl_args[@]}" --dump-header "$site_headers" --output "$site_body" "$SITE_ORIGIN/"
grep -Eqi '^strict-transport-security: .*max-age=' "$site_headers"
grep -Eqi '<link[^>]+rel="canonical"[^>]+href="https://winimibakery.com/?"' "$site_body"
grep -q 'application/ld+json' "$site_body"

curl "${curl_args[@]}" "$SITE_ORIGIN/robots.txt" | grep -q 'Sitemap: https://winimibakery.com/sitemap.xml'
curl "${curl_args[@]}" "$SITE_ORIGIN/sitemap.xml" | grep -q '<urlset'
curl "${curl_args[@]}" "$SITE_ORIGIN/__frontend_health" | grep -q '"status":"ok"'

api_args=(--fail --silent --show-error --max-time 20 --retry 3 --retry-delay 2)
[[ -z "$CURL_RESOLVE_API" ]] || api_args+=(--resolve "$CURL_RESOLVE_API")
curl "${api_args[@]}" --output "$api_body" "$API_ORIGIN/api/system/ready"

python3 - "$api_body" <<'PY'
import json, sys
payload = json.load(open(sys.argv[1], encoding='utf-8'))
if payload.get('success') is not True:
    raise SystemExit('backend readiness envelope is not successful')
data = payload.get('data') or {}
if data.get('ready') is not True and data.get('status') != 'ready':
    raise SystemExit('backend is not ready')
PY

contracts=$(curl "${api_args[@]}" "$API_ORIGIN/api/system/contracts")
python3 - "$contracts" <<'PY'
import json, sys
payload = json.loads(sys.argv[1])
meta = payload.get('meta') or {}
if meta.get('contractVersion') != '2026-07-20-phase-16':
    raise SystemExit('backend contract drift detected')
PY

printf 'Public production smoke checks passed for %s and %s.\n' "$SITE_ORIGIN" "$API_ORIGIN"
