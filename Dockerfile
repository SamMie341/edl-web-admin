# ==========================================
# 1. Build Stage
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app/edl-admin

# Install OpenSSL and certificates required by Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first for better caching
COPY package*.json ./
COPY prisma7.config.ts ./
COPY prisma ./prisma/

RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client & compile NestJS
RUN npx prisma generate
RUN npm run build

# Remove development dependencies, keeping production deps (including prisma CLI)
RUN npm prune --omit=dev

# ==========================================
# 2. Production Stage
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app/edl-admin

# Install runtime OpenSSL and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create uploads folder structure matching join(process.cwd(), '..', 'uploads')
RUN mkdir -p /app/uploads/branches /app/uploads/centers

# Copy application artifacts from builder stage
COPY --from=builder /app/edl-admin/package*.json ./
COPY --from=builder /app/edl-admin/node_modules ./node_modules
COPY --from=builder /app/edl-admin/dist ./dist
COPY --from=builder /app/edl-admin/src/generated ./src/generated
COPY --from=builder /app/edl-admin/prisma ./prisma
COPY --from=builder /app/edl-admin/prisma7.config.ts ./
COPY docker-entrypoint.sh ./

# Ensure correct line endings (LF) and executable permissions for shell script
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
