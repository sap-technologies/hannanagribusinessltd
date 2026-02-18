import sql from '../db.js';

/**
 * Migration: Update photo columns to TEXT for base64 storage
 * Run this before deploying to Render/Vercel
 */

async function migratePhotoColumns() {
  console.log('\n🔄 Migrating photo columns to support base64 storage...\n');

  try {
    // Update goats table photo_url column to TEXT
    console.log('Updating goats.photo_url to TEXT...');
    await sql.unsafe(`
      ALTER TABLE goats 
      ALTER COLUMN photo_url TYPE TEXT
    `);
    console.log('✅ goats.photo_url updated to TEXT');

    // Update users table profile_photo column to TEXT
    console.log('Updating users.profile_photo to TEXT...');
    await sql.unsafe(`
      ALTER TABLE users 
      ALTER COLUMN profile_photo TYPE TEXT
    `);
    console.log('✅ users.profile_photo updated to TEXT');

    console.log('\n✅ Migration completed successfully!');
    console.log('📝 Database is now ready for base64 image storage');
    console.log('🚀 You can now deploy to Render and Vercel!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('Details:', error.message);
    process.exit(1);
  }
}

migratePhotoColumns();
