#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL=${1:-https://winimibakery.com}
CURL=(curl --fail --silent --show-error --location --max-time 20)
if [[ ${SMOKE_INSECURE:-false} == true ]]; then
  CURL+=(--insecure)
fi

headers_for() {
  "${CURL[@]}" --dump-header - --output /dev/null "$1" | tr -d '\r'
}

require_header() {
  local headers=$1
  local pattern=$2
  local label=$3
  if ! grep -Eiq "$pattern" <<<"$headers"; then
    echo "Missing or invalid $label header: expected /$pattern/" >&2
    echo "$headers" >&2
    exit 1
  fi
}

health=$("${CURL[@]}" "$BASE_URL/__frontend_health")
if ! grep -q '"status":"ok"' <<<"$health"; then
  echo "Frontend health endpoint failed: $health" >&2
  exit 1
fi

root_html=$("${CURL[@]}" "$BASE_URL/")
products_html=$("${CURL[@]}" "$BASE_URL/products")
if ! grep -q '<div id="root"></div>' <<<"$root_html"; then
  echo "Root application shell is invalid." >&2
  exit 1
fi
if ! grep -q '<div id="root"></div>' <<<"$products_html"; then
  echo "SPA deep-route fallback is invalid." >&2
  exit 1
fi

root_headers=$(headers_for "$BASE_URL/")
require_header "$root_headers" '^cache-control:.*no-cache' "HTML cache"
require_header "$root_headers" '^strict-transport-security: max-age=31536000; includeSubDomains$' "HSTS"
require_header "$root_headers" '^content-security-policy:.*default-src .self.' "CSP"
require_header "$root_headers" '^content-security-policy:.*frame-ancestors .none.' "CSP frame boundary"
require_header "$root_headers" '^x-content-type-options: nosniff$' "nosniff"
require_header "$root_headers" '^x-frame-options: DENY$' "frame denial"
require_header "$root_headers" '^referrer-policy: strict-origin-when-cross-origin$' "referrer policy"
require_header "$root_headers" '^permissions-policy: camera=\(\), microphone=\(\), geolocation=\(\)$' "permissions policy"

sw_headers=$(headers_for "$BASE_URL/sw.js")
require_header "$sw_headers" '^cache-control:.*no-cache.*no-store' "service worker cache"
require_header "$sw_headers" '^service-worker-allowed: /$' "service worker scope"

manifest_headers=$(headers_for "$BASE_URL/manifest.webmanifest")
require_header "$manifest_headers" '^cache-control:.*no-cache' "manifest cache"
require_header "$manifest_headers" '^content-type: application/manifest\+json' "manifest content type"

asset_path=$(grep -oE '/assets/[^" ]+\.js' <<<"$root_html" | head -n 1)
if [[ -z "$asset_path" ]]; then
  echo "Unable to discover the production JavaScript asset." >&2
  exit 1
fi
asset_headers=$("${CURL[@]}" --compressed --header 'Accept-Encoding: gzip' --dump-header - --output /dev/null "$BASE_URL$asset_path" | tr -d '\r')
require_header "$asset_headers" '^cache-control: public, max-age=31536000, immutable$' "immutable asset cache"
require_header "$asset_headers" '^content-encoding: gzip$' "gzip compression"

if "${CURL[@]}" "$BASE_URL/.env" >/dev/null 2>&1; then
  echo "Sensitive dotfile request unexpectedly succeeded." >&2
  exit 1
fi
if "${CURL[@]}" "$BASE_URL/assets/nonexistent.js.map" >/dev/null 2>&1; then
  echo "Source-map request unexpectedly succeeded." >&2
  exit 1
fi

echo "Frontend HTTPS smoke test passed for $BASE_URL."
