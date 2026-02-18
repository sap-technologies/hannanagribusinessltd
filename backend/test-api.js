import sql from './db.js';

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoints...\n');

    // Test 1: Check if notifications table exists
    const notificationsTable = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
    `;
    console.log(`Notifications table columns: ${notificationsTable.length}`);
    if (notificationsTable.length > 0) {
      console.log('Columns:', notificationsTable.map(c => c.column_name).join(', '));
    } else {
      console.log('❌ Notifications table does not exist!');
    }

    // Test 2: Check if goats table exists and has data
    const goatsCount = await sql`SELECT COUNT(*) as count FROM goats`;
    console.log(`\nGoats count: ${goatsCount[0].count}`);

    // Test 3: Try to query notifications
    try {
      const notifications = await sql`SELECT * FROM notifications LIMIT 1`;
      console.log(`\nNotifications: ${notifications.length} records`);
    } catch (err) {
      console.log(`\n❌ Error querying notifications: ${err.message}`);
    }

    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPI();
