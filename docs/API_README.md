# VirtuBuild - Backend API Documentation

Complete documentation for the VirtuBuild Node.js/Express backend API.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Management](#database-management)
- [Authentication](#authentication)
- [Development](#development)
- [Testing](#testing)
- [Configuration](#configuration)

## Overview

VirtuBuild API is a RESTful backend service built with Node.js, Express, and TypeScript. It provides a comprehensive API for managing users, modules, activities, assessments, grades, and more.

### Key Technologies

- **Runtime**: Node.js
- **Framework**: Express 4.21.2
- **Language**: TypeScript 5.7.3
- **ORM**: TypeORM 0.3.20
- **Database**: PostgreSQL 15
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- **Node.js**: v18+ (recommended: v20+)
- **npm**: v9+
- **PostgreSQL**: v15+
- **Docker** (optional): For containerized setup

### Installation

1. **Navigate to the API directory**:
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
   ```

4. **Update `.env` file**:
   ```env
   APP_DB_HOST=localhost
   APP_DB_PORT=5432
   APP_DB_USERNAME=your_username
   APP_DB_PASSWORD=your_password
   APP_DB_DATABASE=virtubuild_db
   NODE_ENV=development
   PORT=9000
   APP_SECRET_KEY=your-secret-api-key-here
   APP_JWT_SECRET_KEY=your-jwt-secret-key-here
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:4200
   LOG_LEVEL=info
   ```

5. **Setup database**:
   ```bash
   npm run db:setup
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

7. **Access the API**:
   - API: http://localhost:9000
   - API Docs: http://localhost:9000/api-docs

## Project Structure

```
virtubuild-api/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── modules/         # Learning modules
│   │   ├── activities/      # Lab activities
│   │   ├── assessments/     # Assessments
│   │   ├── grades/          # Grades management
│   │   ├── analytics/       # Analytics
│   │   ├── admin/           # Admin operations
│   │   └── ...              # Other modules
│   ├── database/
│   │   ├── entities/        # TypeORM entities
│   │   └── migrations/       # Database migrations
│   ├── middlewares/         # Express middlewares
│   ├── decorators/          # Custom decorators
│   ├── services/            # Shared services
│   ├── utils/               # Utility functions
│   ├── configs/             # Configuration files
│   ├── routers/             # Route definitions
│   └── app.bootstrap.ts     # Application bootstrap
├── scripts/                 # Database scripts
├── dist/                    # Compiled output
└── logs/                    # Application logs
```

## API Endpoints

### Base URL

All API endpoints are prefixed with `/api`:

```
http://localhost:9000/api
```

### Authentication Endpoints

#### Sign In
- **POST** `/api/auth/signin`
- **Description**: Authenticate user and receive JWT token
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`

#### Sign Up
- **POST** `/api/auth/signup`
- **Description**: Register new user
- **Body**: `{ email, password, firstName, lastName, role }`
- **Response**: `{ token, user }`

### System Endpoints

#### Health Check
- **GET** `/api/system/healthcheck`
- **Description**: Check API health status
- **Response**: `{ status: 'ok', timestamp }`

### User Endpoints

#### List Users
- **GET** `/api/users`
- **Description**: Get list of users (paginated)
- **Auth**: Required
- **Query**: `?page=1&limit=10`

#### Get User
- **GET** `/api/users/:id`
- **Description**: Get user by ID
- **Auth**: Required

#### Create User
- **POST** `/api/users`
- **Description**: Create new user
- **Auth**: Required (Admin)

#### Update User
- **PUT** `/api/users/:id`
- **Description**: Update user
- **Auth**: Required

#### Delete User
- **DELETE** `/api/users/:id`
- **Description**: Delete user
- **Auth**: Required (Admin)

### Module Endpoints

#### List Modules
- **GET** `/api/modules`
- **Description**: Get list of learning modules
- **Auth**: Required

#### Get Module
- **GET** `/api/modules/:id`
- **Description**: Get module by ID
- **Auth**: Required

### Activity Endpoints

#### List Activities
- **GET** `/api/activities`
- **Description**: Get list of lab activities
- **Auth**: Required

#### Get Activity
- **GET** `/api/activities/:id`
- **Description**: Get activity by ID
- **Auth**: Required

### Assessment Endpoints

#### List Assessments
- **GET** `/api/assessments`
- **Description**: Get list of assessments
- **Auth**: Required

#### Get Assessment
- **GET** `/api/assessments/:id`
- **Description**: Get assessment by ID
- **Auth**: Required

#### Get by Lab Activity
- **GET** `/api/assessments/lab-activity/:labActivityId`
- **Description**: Get assessments for a lab activity
- **Auth**: Required

### Grade Endpoints

#### List My Grades
- **GET** `/api/grades/me`
- **Description**: Get current user's grades
- **Auth**: Required

#### List Grades for Activity
- **GET** `/api/grades/activity/:activityId`
- **Description**: Get grades for a specific activity
- **Auth**: Required (Instructor/Admin)

### Student Progress Endpoints

#### Get My Progress
- **GET** `/api/student-progress/me`
- **Description**: Get current user's progress
- **Auth**: Required

#### Get Assigned Activities
- **GET** `/api/student-progress/assigned-activities`
- **Description**: Get activities assigned to current user
- **Auth**: Required

#### Submit Progress
- **POST** `/api/student-progress/submit`
- **Description**: Submit activity progress
- **Auth**: Required
- **Body**: `{ activityId, progress, completed }`

### Admin Endpoints

All admin endpoints are prefixed with `/api/admin`:

#### Dashboard Stats
- **GET** `/api/admin/dashboard/stats`
- **Description**: Get dashboard statistics
- **Auth**: Required (Admin)

#### Users Management
- **GET** `/api/admin/users` - List all users
- **GET** `/api/admin/users/:id` - Get user
- **POST** `/api/admin/users` - Create user
- **PUT** `/api/admin/users/:id` - Update user
- **DELETE** `/api/admin/users/:id` - Delete user

#### Modules Management
- **GET** `/api/admin/modules` - List all modules
- **GET** `/api/admin/modules/:id` - Get module
- **POST** `/api/admin/modules` - Create module
- **PUT** `/api/admin/modules/:id` - Update module
- **DELETE** `/api/admin/modules/:id` - Delete module

#### Lab Activities Management
- **GET** `/api/admin/lab-activities` - List all activities
- **GET** `/api/admin/lab-activities/:id` - Get activity
- **POST** `/api/admin/lab-activities` - Create activity
- **PUT** `/api/admin/lab-activities/:id` - Update activity
- **DELETE** `/api/admin/lab-activities/:id` - Delete activity

#### Assessments Management
- **GET** `/api/admin/assessments` - List all assessments
- **GET** `/api/admin/assessments/:id` - Get assessment
- **POST** `/api/admin/assessments` - Create assessment
- **PUT** `/api/admin/assessments/:id` - Update assessment
- **DELETE** `/api/admin/assessments/:id` - Delete assessment

### Assessment Submissions Endpoints

#### Submit Assessment
- **POST** `/api/assessment-submissions/submit`
- **Description**: Submit assessment answers
- **Auth**: Required
- **Body**: `{ assessmentId, answers }`

#### Get My Submissions
- **GET** `/api/assessment-submissions/me`
- **Description**: Get current user's submissions
- **Auth**: Required

#### Get Submission
- **GET** `/api/assessment-submissions/:id`
- **Description**: Get submission by ID
- **Auth**: Required

#### Get by Assessment
- **GET** `/api/assessment-submissions/assessment/:assessmentId`
- **Description**: Get all submissions for an assessment
- **Auth**: Required (Instructor/Admin)

### API Documentation

Interactive API documentation is available via Swagger:

- **Development**: http://localhost:9000/api-docs
- **Production**: `{BASE_URL}/api-docs`

## Database Management

### Available Commands

#### Migration Commands

```bash
# Generate new migration
npm run migration:generate <name>

# Run pending migrations
npm run db:migrate

# Revert last migration
npm run migration:revert
```

#### Seeding Commands

```bash
# Run database seeders
npm run db:seed
```

#### Setup Commands

```bash
# Complete database setup (migrate + seed)
npm run db:setup

# Reset database (⚠️ DESTRUCTIVE)
npm run db:reset

# Check database status
npm run db:status

# Auto-sync schema (development only)
npm run db:sync
```

### Database Workflow

1. **Initial Setup**:
   ```bash
   npm run db:setup
   ```

2. **Adding New Features**:
   ```bash
   npm run migration:generate AddNewTable
   npm run db:migrate
   ```

3. **Development Reset**:
   ```bash
   npm run db:reset
   npm run db:setup
   ```

For detailed database commands, see [DATABASE_COMMANDS.md](../virtubuild-api/DATABASE_COMMANDS.md).

## Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication.

#### Token Structure

- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Secret**: Configurable via `APP_JWT_SECRET_KEY`

#### Using Tokens

Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Protected Routes

Most routes require authentication. Use the `CheckAuthMiddleware` to protect routes.

### Role-Based Access

Some routes require specific roles. Use `CheckRoleMiddleware` with role array:

```typescript
CheckRoleMiddleware(['admin', 'instructor'])
```

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Build and start production server
npm run start:preview

# Format code with Prettier
npm run prettier:format

# Kill process on port 9000
npm run kill:port
```

### Development Server

The development server runs on http://localhost:9000 with:
- **Hot reload** via Nodemon
- **TypeScript compilation** on save
- **Request logging** via Morgan
- **Error handling** with detailed stack traces

### Code Structure

- **Modules**: Feature-based modules in `src/modules/`
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Database operations
- **Entities**: TypeORM database models
- **Routers**: Route definitions
- **Middlewares**: Request processing

## Testing

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Test Structure

Tests are located in `src/__tests__/`:
- **Unit tests**: Service and utility tests
- **Integration tests**: Controller tests
- **E2E tests**: Full API endpoint tests

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_DB_HOST` | Database host | `localhost` |
| `APP_DB_PORT` | Database port | `5432` |
| `APP_DB_USERNAME` | Database username | - |
| `APP_DB_PASSWORD` | Database password | - |
| `APP_DB_DATABASE` | Database name | `virtubuild_db` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `9000` |
| `APP_SECRET_KEY` | API secret key | - |
| `APP_JWT_SECRET_KEY` | JWT secret | - |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:4200` |
| `LOG_LEVEL` | Logging level | `info` |

### Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **HPP**: HTTP Parameter Pollution protection
- **Rate Limiting**: Request rate limiting
- **Password Hashing**: Argon2
- **Input Validation**: class-validator

### Logging

- **Morgan**: HTTP request logging
- **Winston/Pino**: Application logging
- **Log files**: Stored in `logs/` directory

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [Express Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Swagger Documentation](https://swagger.io/)

