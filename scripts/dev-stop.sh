#!/bin/bash

echo "🛑 Stopping VirtuBuild Development Environment"
echo "=============================================="

# Stop and remove development containers
docker-compose -f docker-compose.dev.yml down

echo "✅ Development environment stopped!"
echo "💡 To start again, run: ./scripts/dev-start.sh"
