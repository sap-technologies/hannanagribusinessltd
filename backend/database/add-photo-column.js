import sql from '../db.js';

/**
 * Add photo_url column to goats table if it doesn't exist
 */
async function addPhotoUrlColumn() {
  try {
    // Check if column exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'goats' AND column_name = 'photo_url'
    `;

    if (columnCheck.length === 0) {
      console.log('Adding photo_url column to goats table...');
      
      await sql`
        ALTER TABLE goats 
        ADD COLUMN photo_url VARCHAR(500)
      `;
      
      console.log('✅ photo_url column added successfully');
    } else {
      console.log('✅ photo_url column already exists');
    }
  } catch (error) {
    console.error('Error adding photo_url column:', error);
    throw error;
  }
}

addPhotoUrlColumn();
