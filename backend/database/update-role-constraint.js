/**
 * Database Schema Update: Remove Viewer Role
 * Updates the role CHECK constraint to only allow: admin, manager, staff
 * 
 * Usage: node database/update-role-constraint.js
 */

import sql from '../db.js';

async function updateRoleConstraint() {
  try {
    console.log('🔄 Updating role constraint to remove "viewer"...\n');

    // First, migrate any existing viewer users to staff
    const viewerUsers = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'viewer'
    `;

    if (viewerUsers[0].count > 0) {
      console.log(`⚠️  Found ${viewerUsers[0].count} viewer user(s). Converting to staff first...\n`);
      
      await sql`
        UPDATE users 
        SET role = 'staff', updated_at = CURRENT_TIMESTAMP
        WHERE role = 'viewer'
      `;
      
      console.log(`✅ Converted ${viewerUsers[0].count} viewer user(s) to staff\n`);
    }

    // Drop the old constraint
    console.log('🔧 Dropping old role constraint...');
    await sql`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_role_check
    `;
    console.log('✅ Old constraint dropped\n');

    // Add the new constraint (without viewer)
    console.log('🔧 Adding new role constraint (admin, manager, staff only)...');
    await sql`
      ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'manager', 'staff'))
    `;
    console.log('✅ New constraint added\n');

    // Verify the constraint
    const verification = await sql`
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'users_role_check'
    `;

    if (verification.length > 0) {
      console.log('✅ Constraint verification successful!');
      console.log(`   Constraint: ${verification[0].check_clause}\n`);
    }

    console.log('🎉 Role constraint updated successfully!');
    console.log('   Allowed roles: admin, manager, staff\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run update
updateRoleConstraint();
