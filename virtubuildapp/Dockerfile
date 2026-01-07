FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:prod

FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist/virtubuild-dashboard/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a custom entrypoint script to ensure nginx starts
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'echo "Starting nginx server..."' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 80

# Use custom entrypoint to prevent Railway from running npm
ENTRYPOINT ["/entrypoint.sh"]


