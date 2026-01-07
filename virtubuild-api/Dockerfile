# Use Node.js image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies including dev dependencies for build
RUN npm ci && npm i -g typescript tsc-alias

COPY . .

# Build the application
RUN tsc && tsc-alias -p tsconfig.json

# Prune dev dependencies for production image
RUN npm prune --omit=dev

EXPOSE 9000

ENV NODE_ENV=production

# Create a startup script that runs database setup and then starts the app
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting VirtuBuild API..."' >> /app/start.sh && \
    echo 'echo "🧹 Resetting database (equivalent to npm run db:reset)..."' >> /app/start.sh && \
    echo 'node dist/scripts/simple-db-reset.js || true' >> /app/start.sh && \
    echo 'echo "📡 Setting up database (equivalent to npm run db:setup)..."' >> /app/start.sh && \
    echo 'node dist/scripts/setup-db.js' >> /app/start.sh && \
    echo 'echo "✅ Database ready!"' >> /app/start.sh && \
    echo 'echo "🎯 Starting application..."' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
