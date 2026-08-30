#!/bin/sh
set -eu

# ---- Runtime configuration injection ---------------------------------------
# This script runs before nginx starts. It reads environment variables and the
# mounted Firebase config file, then writes a runtime-config.js that populates
# window.__RUNTIME_CONFIG__ for the Angular app to consume at runtime.
#
# Required environment variables:
#   RABBIT_USERNAME     RabbitMQ STOMP username
#   RABBIT_PASSWORD     RabbitMQ STOMP password
#   RABBIT_VHOST        RabbitMQ virtual host
#   RABBIT_SOCKET_URL  WebSocket URL for STOMP (e.g. wss://host/api/ws)
#   WEB_BASE_URL       Public base URL of the application
#
# Required mounted file:
#   /firebase-config.json  Firebase service account / web config JSON
# ---------------------------------------------------------------------------

HTML_DIR=/usr/share/nginx/html
FIREBASE_CONFIG_FILE=/firebase-config.json
OUTPUT_FILE="${HTML_DIR}/runtime-config.js"

# Read Firebase config from mounted JSON file
if [ ! -f "${FIREBASE_CONFIG_FILE}" ]; then
  echo "ERROR: Firebase config file not found at ${FIREBASE_CONFIG_FILE}" >&2
  echo "       Mount it as a volume: -v /path/to/firebase-config.json:${FIREBASE_CONFIG_FILE}:ro" >&2
  exit 1
fi

if [ -z "${RABBIT_USERNAME:-}" ] || [ -z "${RABBIT_PASSWORD:-}" ] || \
   [ -z "${RABBIT_VHOST:-}" ] || [ -z "${RABBIT_SOCKET_URL:-}" ] || \
   [ -z "${WEB_BASE_URL:-}" ]; then
  echo "ERROR: Missing required environment variables." >&2
  echo "       Required: RABBIT_USERNAME, RABBIT_PASSWORD, RABBIT_VHOST, RABBIT_SOCKET_URL, WEB_BASE_URL" >&2
  exit 1
fi

FIREBASE_JSON=$(cat "${FIREBASE_CONFIG_FILE}")

cat > "${OUTPUT_FILE}" <<EOF
window.__RUNTIME_CONFIG__ = {
  firebaseConfig: ${FIREBASE_JSON},
  rabbit: {
    username: "${RABBIT_USERNAME}",
    password: "${RABBIT_PASSWORD}",
    vHost: "${RABBIT_VHOST}",
    socketUrl: "${RABBIT_SOCKET_URL}",
  },
  webBaseUrl: "${WEB_BASE_URL}",
};
EOF

echo "Runtime config written to ${OUTPUT_FILE}"

exec "$@"
