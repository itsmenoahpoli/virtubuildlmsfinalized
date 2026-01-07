FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS api-deps
WORKDIR /app/api
COPY virtubuild-api/package*.json ./
RUN npm ci && npm cache clean --force

FROM base AS api-build
WORKDIR /app/api
COPY virtubuild-api/package*.json ./
RUN npm ci
COPY virtubuild-api/ ./
RUN npm run build

FROM base AS frontend-deps
WORKDIR /app/frontend
COPY virtubuildapp/package*.json ./
RUN npm ci

FROM base AS frontend-build
WORKDIR /app/frontend
COPY virtubuildapp/package*.json ./
RUN npm ci
COPY virtubuildapp/ ./
RUN npm run build

FROM base AS production

RUN apk add --no-cache \
    dumb-init \
    curl \
    dos2unix

WORKDIR /app

COPY --from=api-deps /app/api/node_modules ./api/node_modules
COPY --from=api-build /app/api/dist ./api/dist
COPY --from=api-build /app/api/package*.json ./api/

COPY --from=frontend-deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=frontend-build /app/frontend/package*.json ./frontend/

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 4200 9000

COPY --chown=nextjs:nodejs ./scripts/start.sh ./
RUN dos2unix ./start.sh && chmod +x ./start.sh

CMD ["dumb-init", "./start.sh"]
