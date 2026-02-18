import pool from './database/config.js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase Connection...\n');

    // Check which connection method is being used
    if (process.env.DATABASE_URL) {
      console.log('✅ Using DATABASE_URL (Supabase connection pooler)');
      console.log(`Connection: ${process.env.DATABASE_URL.substring(0, 50)}...`);
    } else {
      console.log('⚠️  Using local PostgreSQL config');
      console.log(`Host: ${process.env.DB_HOST}`);
      console.log(`Database: ${process.env.DB_NAME}`);
    }

    // Test connection
    console.log('\n📡 Testing connection...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Get database info
    const dbInfo = await client.query('SELECT current_database(), version()');
    console.log(`\n📊 Database: ${dbInfo.rows[0].current_database}`);
    console.log(`PostgreSQL: ${dbInfo.rows[0].version.split(' ')[1]}`);

    // Check tables
    console.log('\n📋 Checking tables...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`Found ${tables.rows.length} tables:`);
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    // Check goats data
    console.log('\n🐐 Testing goats table...');
    const goats = await client.query('SELECT COUNT(*) as count FROM goats');
    console.log(`✅ Goats in database: ${goats.rows[0].count}`);

    // Sample goat
    const sample = await client.query('SELECT * FROM goats LIMIT 1');
    if (sample.rows.length > 0) {
      console.log('\nSample goat:');
      console.log(`  ID: ${sample.rows[0].goat_id}`);
      console.log(`  Breed: ${sample.rows[0].breed}`);
      console.log(`  Sex: ${sample.rows[0].sex}`);
      console.log(`  Status: ${sample.rows[0].status}`);
    }

    client.release();
    await pool.end();

    console.log('\n✅ All tests passed! Supabase connection is working correctly.');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testSupabaseConnection();
