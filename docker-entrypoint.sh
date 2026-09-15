#!/bin/sh
set -e

echo "==> [EDL Admin] Running Prisma database migrations..."
npx prisma migrate deploy

echo "==> [EDL Admin] Migrations applied successfully."
echo "==> [EDL Admin] Starting application server..."
exec "$@"
