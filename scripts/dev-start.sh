#!/bin/bash

echo "🚀 Starting VirtuBuild Development Environment with Live Reload"
echo "=============================================================="

# Check if .env files exist
if [ ! -f "virtubuild-api/.env" ]; then
    echo "⚠️  virtubuild-api/.env not found. Creating from example..."
    cp virtubuild-api/env.example virtubuild-api/.env
fi

if [ ! -f "virtubuildapp/.env" ]; then
    echo "⚠️  virtubuildapp/.env not found. Creating from example..."
    cp virtubuildapp/env.example virtubuildapp/.env
fi

# Create root .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚠️  .env not found. Creating from example..."
    cp env.example .env
fi

echo "📦 Starting development services with live reload..."
echo "   - Backend: http://localhost:9000 (with nodemon for live reload)"
echo "   - Frontend: http://localhost:4200 (with ng serve for live reload)"
echo "   - Database: localhost:5432"
echo "   - PgAdmin: http://localhost:5050"
echo ""
echo "🔄 File changes will automatically reload both frontend and backend!"
echo ""

# Start development environment
docker-compose -f docker-compose.dev.yml up --build
