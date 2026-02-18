/**
 * Migration Script: Convert Viewer Role to Staff
 * Run this once to update any existing 'viewer' users to 'staff' role
 * 
 * Usage: node database/migrate-viewer-to-staff.js
 */

import sql from '../db.js';

async function migrateViewerUsers() {
  try {
    console.log('🔄 Starting migration: Converting viewer users to staff...\n');

    // Check if any viewer users exist
    const viewerUsers = await sql`
      SELECT user_id, email, full_name, role 
      FROM users 
      WHERE role = 'viewer'
    `;

    if (viewerUsers.length === 0) {
      console.log('✅ No viewer users found. Migration not needed.\n');
      process.exit(0);
    }

    console.log(`📋 Found ${viewerUsers.length} viewer user(s):\n`);
    viewerUsers.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email})`);
    });

    // Update all viewer users to staff
    const result = await sql`
      UPDATE users 
      SET role = 'staff', updated_at = CURRENT_TIMESTAMP
      WHERE role = 'viewer'
      RETURNING user_id, email, full_name, role
    `;

    console.log(`\n✅ Successfully migrated ${result.length} user(s) from 'viewer' to 'staff' role\n`);
    
    result.forEach(user => {
      console.log(`   ✓ ${user.full_name} (${user.email}) → ${user.role}`);
    });

    console.log('\n🎉 Migration completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateViewerUsers();
