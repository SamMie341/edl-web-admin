#!/bin/sh
set -e

echo "==> [EDL Admin] Running Prisma database migrations..."
npx prisma migrate deploy

echo "==> [EDL Admin] Migrations applied successfully."

echo "==> [EDL Admin] Seeding initial database data..."
npx prisma db seed || echo "==> [EDL Admin] Seed skipped or already applied."
echo "==> [EDL Admin] Seed check completed."

echo "==> [EDL Admin] Starting application server..."
exec "$@"
