#!/bin/bash

echo "Setting up VirtuBuild Docker environment files..."

# Create .env files from templates
if [ ! -f "virtubuild-api/.env" ]; then
    cp virtubuild-api/.env.example virtubuild-api/.env
    echo "Created virtubuild-api/.env"
else
    echo "virtubuild-api/.env already exists, skipping..."
fi

if [ ! -f "virtubuildapp/.env" ]; then
    cp virtubuildapp/.env.example virtubuildapp/.env
    echo "Created virtubuildapp/.env"
else
    echo "virtubuildapp/.env already exists, skipping..."
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env"
else
    echo ".env already exists, skipping..."
fi

echo ""
echo "Environment files setup complete!"
echo ""
echo "You can now run:"
echo "  docker-compose up --build"
echo ""
echo "Access points:"
echo "  Frontend: http://localhost:4200"
echo "  API: http://localhost:9000"
echo "  pgAdmin: http://localhost:5050"
echo ""
