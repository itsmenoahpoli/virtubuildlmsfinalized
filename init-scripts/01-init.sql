-- Initialize VirtuBuild database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create any additional schemas or initial data here
-- For example:
-- CREATE SCHEMA IF NOT EXISTS virtubuild_schema;

-- You can add initial data or additional setup here
-- INSERT INTO users (username, email) VALUES ('admin', 'admin@virtubuild.com');
