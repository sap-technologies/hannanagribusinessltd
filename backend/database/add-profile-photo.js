import sql from '../db.js';

async function addProfilePhotoColumn() {
  console.log('\n📸 Adding profile photo column to users table...\n');
  
  try {
    // Add profile_photo column to users table
    await sql.unsafe(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(500)
    `);
    
    console.log('✅ profile_photo column added to users table');
    
    // Create uploads/profiles directory if it doesn't exist
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadsDir = path.join(__dirname, '../../uploads/profiles');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads/profiles directory');
    } else {
      console.log('ℹ️  uploads/profiles directory already exists');
    }
    
    console.log('\n✅ Profile photo feature setup complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error adding profile photo column:', error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
    process.exit(0);
  }
}

addProfilePhotoColumn();
