import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Database connection setup using postgres.js
// Make sure DATABASE_URL is set in your .env file
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is missing from environment variables!');
  console.error('   Make sure you have a .env file with DATABASE_URL set.');
  process.exit(1);
}

// Create SQL client - this handles connection pooling automatically
const sql = postgres(connectionString);

export default sql;
