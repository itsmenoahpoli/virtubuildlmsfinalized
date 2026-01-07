# 🗄️ Database Commands

This document describes all available database management commands for the VirtuBuild API.

## 📋 Available Commands

### 🔄 Migration Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run db:migrate` | Run pending migrations | `npm run db:migrate` |
| `npm run migration:generate <name>` | Generate a new migration | `npm run migration:generate AddUserTable` |
| `npm run migration:revert` | Revert the last migration | `npm run migration:revert` |

### 🌱 Seeding Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run db:seed` | Run database seeders | `npm run db:seed` |

### 🏗️ Setup Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run db:setup` | Complete database setup (migrate + seed) | `npm run db:setup` |
| `npm run db:setup:quick` | Quick setup (migrate then seed) | `npm run db:setup:quick` |
| `npm run db:reset` | Reset database (⚠️ DESTRUCTIVE) | `npm run db:reset` |
| `npm run db:status` | Check database status and show commands | `npm run db:status` |
| `npm run db:sync` | Auto-sync database schema (dev only) | `npm run db:sync` |

## 🚀 Quick Start

### For Development
```bash
# Complete setup with migrations and seeders
npm run db:setup

# Or use auto-sync for development
npm run db:sync
```

### For Production
```bash
# Run migrations only
npm run db:migrate

# Then seed if needed
npm run db:seed
```

## 📝 Common Workflows

### 1. Initial Setup
```bash
# Complete database setup
npm run db:setup
```

### 2. Adding New Features
```bash
# Generate migration for schema changes
npm run migration:generate AddNewTable

# Run the migration
npm run db:migrate

# Seed new data if needed
npm run db:seed
```

### 3. Development Reset
```bash
# Reset everything and start fresh
npm run db:reset
npm run db:setup
```

### 4. Production Deployment
```bash
# Only run migrations (no seeding in production)
npm run db:migrate
```

## ⚠️ Important Notes

- **Development**: Use `db:sync` for auto-schema updates
- **Production**: Always use migrations (`db:migrate`)
- **Reset**: `db:reset` will **DELETE ALL DATA** - use with caution
- **Seeding**: Only run seeders in development/staging environments
- **Auto-seeding**: **DISABLED** - `npm run dev` no longer runs seeders automatically
- **Manual Control**: All database operations (migrations, seeding) must be run manually

## 🔧 Environment Variables

Make sure these environment variables are set:

```env
APP_DB_TYPE=postgres
APP_DB_HOST=localhost
APP_DB_PORT=5432
APP_DB_USERNAME=your_username
APP_DB_PASSWORD=your_password
APP_DB_DATABASE=your_database
```

## 📁 File Structure

```
scripts/
├── migrate.ts           # Run migrations
├── generate-migration.ts # Generate new migrations
├── seed.ts              # Run seeders
├── reset-db.ts          # Reset database
└── setup-db.ts          # Complete setup

src/database/
├── entities/            # TypeORM entities
└── migrations/          # Migration files
```

## 🐛 Troubleshooting

### Migration Issues
```bash
# Check migration status
npm run db:migrate

# Revert if needed
npm run migration:revert
```

### Seeding Issues
```bash
# Run seeders individually
npm run db:seed
```

### Connection Issues
- Verify environment variables
- Check database server is running
- Ensure database exists
- Check connection credentials
