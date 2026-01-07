# VirtuBuild Docker Setup

This Docker configuration runs both the API and frontend applications in a single container, along with PostgreSQL and pgAdmin.

## Services

- **app**: Combined API (port 9000) and Frontend (port 4200) application
- **postgres**: PostgreSQL database (port 5432)
- **pgadmin**: pgAdmin web interface (port 5050)

## Prerequisites

- **Docker**: v20+ with Docker Compose
- **Make** (optional): For using convenience commands

## Quick Start

### Option 1: Using Makefile Commands (Recommended)

1. **Setup environment files**:

   ```bash
   make setup
   ```

2. **Build and start all services**:

   ```bash
   make up-build
   ```

3. **Access the applications**:
   - Frontend: http://localhost:4200
   - API: http://localhost:9000
   - pgAdmin: http://localhost:5050

### Option 2: Using Docker Compose Directly

1. **Copy environment files**:

   ```bash
   cp virtubuild-api/.env.example virtubuild-api/.env
   cp virtubuildapp/.env.example virtubuildapp/.env
   cp .env.example .env
   ```

2. **Build and start all services**:

   ```bash
   docker-compose up --build
   ```

## Available Makefile Commands

```bash
make help          # Show all available commands
make setup         # Setup environment files
make build         # Build Docker images
make up            # Start all services
make up-build      # Build and start all services
make down          # Stop all services
make logs          # Show logs for all services
make logs-app      # Show logs for app service only
make logs-db       # Show logs for database service only
make clean         # Remove all containers, networks, and volumes
make restart       # Restart all services
make status        # Show status of all services
make dev           # Start only database services for development
```

## Environment Configuration

### Main Configuration (.env)
```env
POSTGRES_USER=virtubuild
POSTGRES_PASSWORD=virtubuild123
POSTGRES_DB=virtubuild_db
PGADMIN_EMAIL=admin@virtubuild.com
PGADMIN_PASSWORD=admin123
API_PORT=9000
FRONTEND_PORT=4200
```

### Backend Configuration (virtubuild-api/.env)
```env
APP_DB_HOST=postgres
APP_DB_PORT=5432
APP_DB_USERNAME=virtubuild
APP_DB_PASSWORD=virtubuild123
APP_DB_DATABASE=virtubuild_db
NODE_ENV=production
PORT=9000
API_KEY=your-secret-api-key-here
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:4200
LOG_LEVEL=info
```

### Frontend Configuration (virtubuildapp/.env)
```env
VITE_API_BASE_URL=http://localhost:9000/api
ENVIRONMENT=production
APP_TITLE=VirtuBuild Dashboard
APP_VERSION=1.0.0
ENABLE_ANALYTICS=false
ENABLE_DEBUG=false
```

**Note**: Copy the `.env.example` files to `.env` files before running Docker Compose, or use `make setup` to do this automatically.

## pgAdmin Access

- **URL**: http://localhost:5050
- **Email**: admin@virtubuild.com
- **Password**: admin123

To connect to the PostgreSQL database in pgAdmin:

- **Host**: postgres
- **Port**: 5432
- **Database**: virtubuild_db
- **Username**: virtubuild
- **Password**: virtubuild123

## Development

For development with hot reload:

```bash
# Start only database services
docker-compose up postgres pgadmin

# Run API in development mode
cd virtubuild-api
npm run dev

# Run frontend in development mode
cd virtubuildapp
npm start
```

## Production Deployment

```bash
# Build and start in production mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 4200, 9000, 5432, and 5050 are available
2. **Database connection**: Wait for PostgreSQL health check to pass before starting the app
3. **Environment variables**: Make sure all .env files are properly configured
4. **Build issues**: Clear Docker cache with `docker system prune -a`

## Database Management

### PostgreSQL Configuration
- **Version**: PostgreSQL 15 (Alpine)
- **Default Database**: `virtubuild_db`
- **Default User**: `virtubuild`
- **Port**: 5432

### Database Schema
The application uses TypeORM entities for database management:
- **User Entity**: User management and authentication
- **User Role Entity**: Role-based access control
- **Shared Entity**: Common fields (timestamps, soft deletes)

## Deployment

### Production Deployment
```bash
# Build and start in production mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Health Checks
- **API Health**: `GET /api/system/healthcheck`
- **Database Health**: Built-in PostgreSQL health checks

## Data Persistence

- PostgreSQL data is persisted in the `postgres_data` volume
- pgAdmin data is persisted in the `pgadmin_data` volume
- Application code is mounted as volumes for development

## Monitoring & Logging

### Application Logs
- **Backend Logs**: `virtubuild-api/logs/`
- **Request Logs**: Morgan middleware for HTTP request logging
- **Error Logs**: Global error handling middleware

### Viewing Logs
```bash
# All services
make logs

# Application only
make logs-app

# Database only
make logs-db

# Or using docker-compose
docker-compose logs -f [service-name]
```
