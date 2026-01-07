#!/bin/sh

set -e

echo "🚀 Starting VirtuBuild application..."

echo "📡 Setting up database..."
cd /app/virtubuild-api
npm run db:setup

echo "✅ Database setup completed!"

echo "🎯 Starting services..."

cd /app/virtubuild-api
echo "Starting API server on port 9000..."
npm start &
API_PID=$!

cd /app/virtubuildapp
echo "Starting frontend server on port 4200..."
npx http-server dist -p 4200 -a 0.0.0.0 &
FRONTEND_PID=$!

echo "✅ Both services started successfully!"
echo "🌐 API: http://localhost:9000"
echo "🌐 Frontend: http://localhost:4200"

wait $API_PID $FRONTEND_PID
