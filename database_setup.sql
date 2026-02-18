# Database Creation Script for PostgreSQL
# Run this in PostgreSQL (psql) or pgAdmin before running the application

-- Create database
CREATE DATABASE hannan_agribusiness;

-- Connect to the database
\c hannan_agribusiness

-- Create user (optional, if you want a dedicated user)
-- CREATE USER hannan_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE hannan_agribusiness TO hannan_user;

-- The tables will be created automatically when you run: npm run db:setup
-- from the backend directory

-- Verify connection
SELECT version();

-- Show message
SELECT 'Database hannan_agribusiness created successfully!' AS status;
