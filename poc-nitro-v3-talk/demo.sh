#!/usr/bin/env bash
# Demo driver for the Nitro v3 talk.
#
#   ./demo.sh dev         start the dev server on :3100
#   ./demo.sh cache       show function cache: 300ms -> 0.4ms
#   ./demo.sh time        show route-rule cache: the clock freezes
#   ./demo.sh auth        show basicAuth with zero auth code
#   ./demo.sh build-all   build for 5 presets and print sizes
#   ./demo.sh tree        show the whole server in 6 files
#
# Everything prints big and slow enough to read from the back of a room.

set -uo pipefail
cd "$(dirname "$0")"

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 20 >/dev/null 2>&1

PORT="${PORT:-3100}"
B="http://localhost:$PORT"

BOLD=$'\e[1m'; DIM=$'\e[2m'; OFF=$'\e[0m'
ORANGE=$'\e[38;5;214m'; GREEN=$'\e[38;5;46m'; RED=$'\e[38;5;203m'; CYAN=$'\e[38;5;51m'

hr()  { printf '%s%s%s\n' "$DIM" "────────────────────────────────────────────────────────────" "$OFF"; }
say() { printf '\n%s%s%s\n' "$BOLD$ORANGE" "$1" "$OFF"; hr; }
cmd() { printf '%s$ %s%s\n' "$CYAN" "$1" "$OFF"; }

need_server() {
  if ! curl -s -o /dev/null --max-time 2 "$B/api/hello"; then
    printf '%s✗ Nothing on %s — run ./demo.sh dev in another tab first.%s\n' "$RED" "$B" "$OFF"
    exit 1
  fi
}

case "${1:-help}" in

dev)
  say "Starting Nitro dev server on port $PORT"
  cmd "PORT=$PORT npm run dev"
  exec env PORT="$PORT" npm run dev
  ;;

tree)
  say "The entire server"
  find server -type f | sort | sed 's/^/  /'
  echo
  printf '  %s%s files. That is the whole thing.%s\n' "$DIM" "$(find server -type f | wc -l | tr -d ' ')" "$OFF"
  echo
  cmd "cat nitro.config.ts"
  ;;

cache)
  need_server
  say "defineCachedFunction — same handler, 6 calls"
  cmd "curl $B/api/stars/nitrojs/nitro"
  echo
  for i in $(seq 1 6); do
    out=$(curl -s "$B/api/stars/nitrojs/nitro")
    ms=$(printf '%s' "$out"    | sed -n 's/.*"ms":\([0-9.]*\).*/\1/p')
    src=$(printf '%s' "$out"   | sed -n 's/.*"source":"\([a-z]*\)".*/\1/p')
    stars=$(printf '%s' "$out" | sed -n 's/.*"stars":\([0-9]*\).*/\1/p')
    if [ "$src" = "cache" ]; then col=$GREEN; else col=$ORANGE; fi
    printf '  call %d   %s%8s ms   %-8s%s   %s★ %s%s\n' \
      "$i" "$col$BOLD" "$ms" "$src" "$OFF" "$DIM" "$stars" "$OFF"
  done
  echo
  printf '  %sFirst call hit GitHub. The rest came from the storage layer.%s\n' "$DIM" "$OFF"
  printf '  %sNo redis client. No connection string. One wrapper function.%s\n' "$DIM" "$OFF"
  ;;

time)
  need_server
  say "Route-rule caching — \"/api/time\": { swr: 10 }"
  cmd "curl $B/api/time   # x4"
  echo
  for i in $(seq 1 4); do
    printf '  %s\n' "$(curl -s "$B/api/time")"
  done
  echo
  printf '  %sThat handler returns new Date() on every call.%s\n' "$DIM" "$OFF"
  printf '  %sIt contains no caching code. The cache is one line of config.%s\n' "$DIM" "$OFF"
  echo
  cmd "curl -I $B/api/time"
  curl -s -D - -o /dev/null "$B/api/time" \
    | grep -iE 'cache-control|etag|last-modified' | sed 's/^/  /'
  echo
  printf '  %scache-control and etag were generated for me.%s\n' "$DIM" "$OFF"
  ;;

auth)
  need_server
  say "basicAuth — declared in config, absent from the handler"
  cmd "curl -i $B/admin"
  printf '  -> HTTP %s%s%s\n' "$RED$BOLD" "$(curl -s -o /dev/null -w '%{http_code}' "$B/admin")" "$OFF"
  echo
  cmd "curl -u nitro:demo $B/admin"
  printf '  -> HTTP %s%s%s  ' "$GREEN$BOLD" "$(curl -s -o /dev/null -w '%{http_code}' -u nitro:demo "$B/admin")" "$OFF"
  curl -s -u nitro:demo "$B/admin" | sed 's/<[^>]*>//g' | tr -s ' \n' ' '
  echo; echo
  cmd "cat server/routes/admin/index.ts   # grep -c auth  ->  0"
  ;;

build-all)
  say "One codebase, five deployment targets"
  for p in "" cloudflare_module vercel deno_deploy bun; do
    label="${p:-node}"
    printf '  %s%-20s%s ' "$BOLD" "$label" "$OFF"
    if NITRO_PRESET="$p" npx nitro build > "/tmp/nitro-build-$label.log" 2>&1; then
      size=$(grep -o 'Total size: .*' "/tmp/nitro-build-$label.log" | tail -1)
      printf '%s✓%s  %s\n' "$GREEN$BOLD" "$OFF" "$size"
    else
      printf '%s✗ failed%s (see /tmp/nitro-build-%s.log)\n' "$RED$BOLD" "$OFF" "$label"
    fi
  done
  echo
  printf '  %sSame source files. Nothing changed between runs but NITRO_PRESET.%s\n' "$DIM" "$OFF"
  printf '  %sCloudflare is smaller than Node — unenv dropped the Node compat layer.%s\n' "$DIM" "$OFF"
  ;;

all)
  "$0" tree; "$0" cache; "$0" time; "$0" auth
  ;;

*)
  printf '%s\n' "usage: ./demo.sh {dev|tree|cache|time|auth|build-all|all}"
  ;;
esac
