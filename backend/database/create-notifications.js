import sql from '../db.js';

async function createNotificationsTable() {
  console.log('\n🔔 Creating Notifications System...\n');
  
  try {
    // Create notifications table
    console.log('Creating notifications table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('vaccination', 'breeding', 'health', 'general', 'reminder')),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255),
        priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMP,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
    `);
    
    console.log('✅ Notifications table created');
    
    // Create reminders table for scheduled reminders
    console.log('\nCreating reminders table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS reminders (
        reminder_id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL CHECK (type IN ('vaccination', 'breeding', 'health_checkup', 'deworming', 'feeding')),
        reference_id INTEGER NOT NULL,
        reference_table VARCHAR(50) NOT NULL,
        reminder_date DATE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        notification_sent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_reminders_type ON reminders(type);
      CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(reminder_date);
      CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(is_completed);
    `);
    
    console.log('✅ Reminders table created');
    
    console.log('\n✅ Notifications system created successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error creating notifications system:', error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
    process.exit(0);
  }
}

createNotificationsTable();
