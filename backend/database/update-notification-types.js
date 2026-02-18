import sql from '../db.js';

/**
 * Update notifications table to support all notification types used by the system
 */

async function updateNotificationTypes() {
  console.log('📝 Updating notification types...\n');

  try {
    // Drop the old constraint
    console.log('Removing old type constraint...');
    await sql.unsafe(`
      ALTER TABLE notifications 
      DROP CONSTRAINT IF EXISTS notifications_type_check
    `);

    // Add new constraint with all types
    console.log('Adding new type constraint with expanded types...');
    await sql.unsafe(`
      ALTER TABLE notifications
      ADD CONSTRAINT notifications_type_check 
      CHECK (type IN (
        'vaccination', 
        'breeding', 
        'health', 
        'general', 
        'reminder',
        'goat',
        'feeding',
        'expense',
        'sale',
        'growth',
        'report',
        'farm',
        'system'
      ))
    `);

    console.log('✅ Notification types updated successfully!');
    console.log('\nSupported notification types:');
    console.log('   • vaccination - Vaccination reminders');
    console.log('   • breeding - Breeding records');
    console.log('   • health - Health issues and treatments');
    console.log('   • general - General notifications');
    console.log('   • reminder - Scheduled reminders');
    console.log('   • goat - Goat registrations and updates');
    console.log('   • feeding - Feeding records');
    console.log('   • expense - Expense records');
    console.log('   • sale - Sales records');
    console.log('   • growth - Kid growth records');
    console.log('   • report - Monthly summaries and reports');
    console.log('   • farm - Coffee and Matooke farm records');
    console.log('   • system - System notifications');

  } catch (error) {
    console.error('❌ Error updating notification types:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

updateNotificationTypes();
