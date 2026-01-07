# VirtuBuild - Tech Stack & Environment Guide

Complete guide to technologies, prerequisites, frameworks, libraries, and environment setup for the VirtuBuild platform.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Tech Stack Overview](#tech-stack-overview)
- [Frontend Stack](#frontend-stack)
- [Backend Stack](#backend-stack)
- [Infrastructure](#infrastructure)
- [Environment Setup](#environment-setup)
- [Docker Setup](#docker-setup)
- [Localhost Setup](#localhost-setup)

## Prerequisites

### Required Software

| Software           | Minimum Version | Recommended Version | Purpose                       |
| ------------------ | --------------- | ------------------- | ----------------------------- |
| **Node.js**        | v18.0.0         | v20.0.0+            | JavaScript runtime            |
| **npm**            | v9.0.0          | Latest              | Package manager               |
| **Docker**         | v20.0.0         | Latest              | Containerization              |
| **Docker Compose** | v2.0.0          | Latest              | Multi-container orchestration |
| **Git**            | Latest          | Latest              | Version control               |
| **PostgreSQL**     | v15.0           | v15+                | Database (if running locally) |

### System Requirements

- **Operating System**: macOS, Linux, or Windows (with WSL2)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: Minimum 2GB free space
- **CPU**: Multi-core processor recommended

### Development Tools (Optional)

- **VS Code** or **WebStorm** - Code editor
- **Postman** or **Insomnia** - API testing
- **pgAdmin** or **DBeaver** - Database management
- **Docker Desktop** - GUI for Docker management

## Tech Stack Overview

VirtuBuild is a full-stack application built with modern web technologies:

- **Frontend**: Angular 19 with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **State Management**: NgRx
- **UI Framework**: Angular Material + Taiga UI

## Frontend Stack

### Core Framework

- **Angular**: `^19.1.0` - Modern web framework
- **TypeScript**: `~5.7.2` - Type-safe JavaScript
- **RxJS**: `~7.8.0` - Reactive programming

### Build Tools

- **Vite**: Via `@analogjs/vite-plugin-angular` - Fast build tool
- **Angular CLI**: `^19.1.7` - Development tooling
- **PostCSS**: `^8.5.3` - CSS processing

### UI Libraries & Components

- **Angular Material**: `^19.2.14` - Material Design components
  - CDK: `^19.2.14` - Component Dev Kit
- **Taiga UI**: `^4.38.0` - Comprehensive UI kit
  - `@taiga-ui/core` - Core components
  - `@taiga-ui/kit` - UI components
  - `@taiga-ui/layout` - Layout components
  - `@taiga-ui/addon-table` - Data tables
  - `@taiga-ui/addon-charts` - Charts and graphs
  - `@taiga-ui/addon-mobile` - Mobile components
  - `@taiga-ui/icons` - Icon library

### Styling

- **SCSS**: Syntactically Awesome Style Sheets
- **Tailwind CSS**: `^4.1.5` - Utility-first CSS framework
- **PostCSS**: CSS processing

### State Management

- **NgRx Store**: `^19.2.0` - State management
- **NgRx Effects**: `^19.2.0` - Side effects
- **NgRx Entity**: `^19.2.0` - Entity management
- **NgRx Store DevTools**: `^19.2.0` - Development tools

### Icons

- **FontAwesome**: `^6.7.2` - Icon library
  - `@fortawesome/angular-fontawesome` - Angular integration
  - `@fortawesome/fontawesome-svg-core` - Core library
  - `@fortawesome/free-solid-svg-icons` - Solid icons

### HTTP Client

- **Axios**: `^1.9.0` - HTTP client for API requests

### Development Dependencies

- **Jasmine**: `~5.1.0` - Testing framework
- **Karma**: `~6.4.0` - Test runner
- **TypeScript**: Type checking and compilation

## Backend Stack

### Core Runtime & Framework

- **Node.js**: JavaScript runtime
- **Express**: `^4.21.2` - Web application framework
- **TypeScript**: `^5.7.3` - Type-safe JavaScript

### Database & ORM

- **PostgreSQL**: `^15` - Relational database
- **TypeORM**: `^0.3.20` - Object-Relational Mapping
- **pg**: `^8.13.1` - PostgreSQL client

### Authentication & Security

- **jsonwebtoken**: `^9.0.2` - JWT authentication
- **argon2**: `^0.41.1` - Password hashing
- **helmet**: `^8.0.0` - Security headers
- **cors**: `^2.8.5` - Cross-Origin Resource Sharing
- **hpp**: `^0.2.3` - HTTP Parameter Pollution protection
- **express-rate-limit**: `^7.4.1` - Rate limiting

### Validation & Transformation

- **class-validator**: `^0.14.1` - Decorator-based validation
- **class-transformer**: `^0.5.1` - Object transformation

### Documentation

- **swagger-jsdoc**: `^6.2.8` - Swagger documentation
- **swagger-ui-express**: `^5.0.1` - Swagger UI

### Logging & Monitoring

- **morgan**: `^1.10.0` - HTTP request logger
- **winston**: `^3.14.2` - Logging library
- **pino**: `^9.4.0` - Fast logger
- **pino-pretty**: `^11.0.0` - Pretty print logs

### Caching & Queue

- **Redis**: `^4.7.0` - In-memory data store
- **ioredis**: `^5.4.1` - Redis client
- **bullmq**: `^5.15.0` - Job queue

### Utilities

- **compression**: `^1.7.5` - Response compression
- **multer**: `^1.4.5-lts.1` - File upload handling
- **nodemailer**: `^6.9.15` - Email sending
- **otplib**: `^12.0.1` - OTP generation
- **qrcode**: `^1.5.4` - QR code generation
- **socket.io**: `^4.8.1` - WebSocket communication
- **axios**: `^1.12.2` - HTTP client
- **chalk**: `^4.1.2` - Terminal styling

### Development Tools

- **nodemon**: `^3.1.9` - Auto-restart on file changes
- **ts-node**: `^10.9.2` - TypeScript execution
- **tsc-alias**: `^1.8.10` - Path alias resolution
- **prettier**: `^3.4.2` - Code formatting
- **jest**: `^29.7.0` - Testing framework
- **supertest**: `^7.0.0` - HTTP assertions

## Infrastructure

### Containerization

- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration

### Database Management

- **pgAdmin**: Web-based PostgreSQL administration

### Process Management

- **PM2** (optional): Process manager for production

## Environment Setup

### Environment Variables

The application uses environment-specific configuration files:

#### Root Environment (`.env`)

```env
POSTGRES_USER=virtubuild
POSTGRES_PASSWORD=virtubuild123
POSTGRES_DB=virtubuild_db
PGADMIN_EMAIL=admin@virtubuild.com
PGADMIN_PASSWORD=admin123
API_PORT=9000
FRONTEND_PORT=4200
```

#### Backend Environment (`virtubuild-api/.env`)

```env
APP_DB_HOST=postgres
APP_DB_PORT=5432
APP_DB_USERNAME=virtubuild
APP_DB_PASSWORD=virtubuild123
APP_DB_DATABASE=virtubuild_db
NODE_ENV=production
PORT=9000
APP_SECRET_KEY=your-secret-api-key-here
APP_JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:4200
LOG_LEVEL=info
```

#### Frontend Environment (`virtubuildapp/.env`)

```env
VITE_API_BASE_URL=http://localhost:9000/api
VITE_API_TIMEOUT_MS=10000
ENVIRONMENT=production
APP_TITLE=VirtuBuild Dashboard
APP_VERSION=1.0.0
ENABLE_ANALYTICS=false
ENABLE_DEBUG=false
```

## Docker Setup

### Quick Start with Docker

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd virtubuildallapp-repo
   ```

2. **Setup environment files**:

   ```bash
   cp env.example .env
   cp virtubuild-api/env.example virtubuild-api/.env
   cp virtubuildapp/env.example virtubuildapp/.env
   ```

3. **Start all services**:
   ```bash
   docker-compose up --build
   ```

### Docker Services

- **app**: Combined API and Frontend (ports 9000, 4200)
- **postgres**: PostgreSQL database (port 5432)
- **pgadmin**: Database administration (port 5050)

### Docker Development Mode

For development with live reload:

```bash
./scripts/dev-start.sh
```

This uses `docker-compose.dev.yml` which:

- Mounts source code as volumes
- Enables hot reload for both frontend and backend
- Runs development servers

### Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres

# Remove containers and volumes
docker-compose down -v
```

### Access Points (Docker)

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:9000
- **API Documentation**: http://localhost:9000/api-docs
- **pgAdmin**: http://localhost:5050

### pgAdmin Access (Docker)

- **Email**: admin@virtubuild.com
- **Password**: admin123
- **Database Host**: postgres
- **Port**: 5432
- **Database**: virtubuild_db
- **Username**: virtubuild
- **Password**: virtubuild123

## Localhost Setup

### Prerequisites for Local Development

1. **Install Node.js** (v18+ recommended):

   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20

   # Or download from nodejs.org
   ```

2. **Install PostgreSQL**:

   ```bash
   # macOS (using Homebrew)
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt-get install postgresql-15

   # Windows
   # Download from postgresql.org
   ```

3. **Create database**:
   ```bash
   createdb virtubuild_db
   ```

### Backend Setup (Localhost)

1. **Navigate to API directory**:

   ```bash
   cd virtubuild-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment**:

   ```bash
   cp env.example .env
   # Edit .env with your local database credentials
   ```

4. **Update `.env` for localhost**:

   ```env
   APP_DB_HOST=localhost
   APP_DB_PORT=5432
   APP_DB_USERNAME=your_username
   APP_DB_PASSWORD=your_password
   APP_DB_DATABASE=virtubuild_db
   NODE_ENV=development
   PORT=9000
   ```

5. **Setup database**:

   ```bash
   npm run db:setup
   ```

6. **Start development server**:

   ```bash
   npm run dev
   ```

   Backend runs on: http://localhost:9000

### Frontend Setup (Localhost)

1. **Navigate to app directory**:

   ```bash
   cd virtubuildapp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment**:

   ```bash
   cp env.example .env
   ```

4. **Update `.env` for localhost**:

   ```env
   VITE_API_BASE_URL=http://localhost:9000/api
   ENVIRONMENT=development
   ```

5. **Start development server**:

   ```bash
   npm start
   ```

   Frontend runs on: http://localhost:4200

### Database Setup (Localhost)

1. **Create PostgreSQL database**:

   ```bash
   createdb virtubuild_db
   ```

2. **Run migrations** (if using TypeORM migrations):

   ```bash
   cd virtubuild-api
   npm run migration:generate
   ```

3. **Seed database** (optional):
   ```bash
   npm run db:seed
   ```

### Running Both Services Locally

**Terminal 1 - Backend**:

```bash
cd virtubuild-api
npm run dev
```

**Terminal 2 - Frontend**:

```bash
cd virtubuildapp
npm start
```

### Development Workflow

1. **Make code changes** in `virtubuild-api/src/` or `virtubuildapp/src/`
2. **Backend**: Nodemon automatically restarts on file changes
3. **Frontend**: Angular CLI automatically refreshes browser
4. **Test changes** at http://localhost:4200

## Troubleshooting

### Common Issues

1. **Port already in use**:

   ```bash
   # Kill process on port 9000 (backend)
   lsof -ti:9000 | xargs kill -9

   # Kill process on port 4200 (frontend)
   lsof -ti:4200 | xargs kill -9
   ```

2. **Database connection errors**:

   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Docker issues**:

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Remove all containers
   docker-compose down -v
   ```

4. **Node modules issues**:
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Express Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
