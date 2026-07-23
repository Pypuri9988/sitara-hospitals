#!/bin/sh
set -e

# Persistent-volume hosts (Railway, Coolify, etc.) often mount the data
# volume owned by root. Fix ownership so the non-root app user can write,
# then drop privileges before starting the server.
mkdir -p /app/data
chown -R nextjs:nodejs /app/data 2>/dev/null || true

exec gosu nextjs "$@"
