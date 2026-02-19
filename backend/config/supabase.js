import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured. Image uploads will not work.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Upload image to Supabase Storage
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Name for the file
 * @param {string} bucket - Storage bucket name (default: 'goat-images')
 * @returns {Promise<{url: string, path: string}>} - Public URL and storage path
 */
export async function uploadImageToSupabase(fileBuffer, fileName, bucket = 'goat-images') {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment variables.');
    }

    console.log(`Uploading to Supabase: bucket=${bucket}, file=${fileName}, size=${fileBuffer.length}`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    console.log('Upload successful, getting public URL...');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log(`Public URL: ${publicUrl}`);

    return {
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', {
      message: error.message,
      bucket,
      fileName,
      hasCredentials: !!(supabaseUrl && supabaseKey)
    });
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} filePath - Path of the file in storage
 * @param {string} bucket - Storage bucket name (default: 'goat-images')
 */
export async function deleteImageFromSupabase(filePath, bucket = 'goat-images') {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
    }
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
  }
}

export default supabase;
