// Load Test Data using Node.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function loadTestData() {
  console.log('📊 Loading test data...');
  console.log('');
  
  try {
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'test-data.sql'), 'utf8');
    
    // Split by semicolons but keep the statements intact
    // Remove comments and empty lines
    const statements = sqlFile
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    console.log('');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      try {
        await pool.query(statements[i]);
        process.stdout.write(`\rProgress: ${i + 1}/${statements.length} statements executed`);
      } catch (error) {
        console.log('');
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        // Continue with other statements
      }
    }
    
    console.log('');
    console.log('');
    console.log('✅ Test data loaded successfully!');
    console.log('');
    console.log('Data Summary:');
    
    // Count records in each table
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM goats'),
      pool.query('SELECT COUNT(*) FROM breeding'),
      pool.query('SELECT COUNT(*) FROM health'),
      pool.query('SELECT COUNT(*) FROM vaccination'),
      pool.query('SELECT COUNT(*) FROM feeding'),
      pool.query('SELECT COUNT(*) FROM sales_breeding'),
      pool.query('SELECT COUNT(*) FROM sales_meat'),
      pool.query('SELECT COUNT(*) FROM kid_growth'),
      pool.query('SELECT COUNT(*) FROM expenses')
    ]);
    
    console.log(`  ✓ Goats: ${counts[0].rows[0].count}`);
    console.log(`  ✓ Breeding Records: ${counts[1].rows[0].count}`);
    console.log(`  ✓ Health Records: ${counts[2].rows[0].count}`);
    console.log(`  ✓ Vaccination Records: ${counts[3].rows[0].count}`);
    console.log(`  ✓ Feeding Records: ${counts[4].rows[0].count}`);
    console.log(`  ✓ Sales (Breeding): ${counts[5].rows[0].count}`);
    console.log(`  ✓ Sales (Meat): ${counts[6].rows[0].count}`);
    console.log(`  ✓ Kid Growth Records: ${counts[7].rows[0].count}`);
    console.log(`  ✓ Expense Records: ${counts[8].rows[0].count}`);
    console.log('');
    console.log('🎉 You can now test all breeding farm features with real data!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error loading test data:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

loadTestData();
