import pool from './database/config.js';

async function checkGoatCount() {
  try {
    console.log('🔍 Checking goat database statistics...\n');

    // Total count
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM goats');
    console.log(`📊 Total registered goats: ${totalResult.rows[0].count}`);

    // Count by status
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM goats 
      GROUP BY status 
      ORDER BY count DESC
    `);
    
    console.log('\n📈 Breakdown by status:');
    statusResult.rows.forEach(row => {
      console.log(`   ${row.status || 'NULL'}: ${row.count} goats`);
    });

    // Active goats (what the API returns by default)
    const activeResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM goats 
      WHERE status = 'Active'
    `);
    console.log(`\n✅ Active goats (shown in app): ${activeResult.rows[0].count}`);

    // Recent goats
    const recentResult = await pool.query(`
      SELECT goat_id, breed, sex, status, date_of_birth::date
      FROM goats 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('\n🐐 Last 10 registered goats:');
    recentResult.rows.forEach((goat, index) => {
      console.log(`   ${index + 1}. ${goat.goat_id} - ${goat.breed} (${goat.sex}) - Status: ${goat.status} - Born: ${goat.date_of_birth}`);
    });

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkGoatCount();
