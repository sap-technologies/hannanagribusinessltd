import sql from '../db.js';

/**
 * Add performer information to notifications table
 * Track who performed the action that triggered the notification
 */

async function addPerformerToNotifications() {
  console.log('📝 Adding performer tracking to notifications...\n');

  try {
    // Add performed_by column
    console.log('Adding performed_by column...');
    await sql.unsafe(`
      ALTER TABLE notifications 
      ADD COLUMN IF NOT EXISTS performed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
    `);

    // Add performed_by_name column (denormalized for faster queries)
    console.log('Adding performed_by_name column...');
    await sql.unsafe(`
      ALTER TABLE notifications 
      ADD COLUMN IF NOT EXISTS performed_by_name VARCHAR(255)
    `);

    // Add index on performed_by
    console.log('Adding index...');
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_notifications_performed_by 
      ON notifications(performed_by)
    `);

    console.log('\n✅ Successfully added performer tracking!');
    console.log('\nNotifications now include:');
    console.log('   • performed_by - User ID who performed the action');
    console.log('   • performed_by_name - User name (cached for performance)');
    console.log('   • Indexed for fast queries by performer');

  } catch (error) {
    console.error('❌ Error adding performer tracking:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

addPerformerToNotifications();
