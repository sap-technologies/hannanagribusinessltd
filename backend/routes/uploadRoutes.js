import express from 'express';
import upload from '../middleware/fileUpload.js';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../config/supabase.js';
import compressImage from '../middleware/imageCompression.js';
import sql from '../db.js';
import sharp from 'sharp';

const router = express.Router();

/**
 * POST /api/upload/goat-photo/:id
 * Upload photo for a specific goat - stores in Supabase Storage
 * Returns public URL for fast loading
 */
router.post('/goat-photo/:id', upload.single('photo'), async (req, res) => {
  try {
    const goatId = req.params.id;
    
    console.log(`📸 Uploading photo for goat: ${goatId}`);
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Compress image using sharp
    console.log('Compressing image...');
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log(`Compressed size: ${compressedBuffer.length} bytes`);

    // Generate unique filename
    const fileName = `goats/${goatId}-${Date.now()}.jpg`;
    console.log(`Uploading to Supabase as: ${fileName}`);

    // Upload to Supabase Storage
    const { url, path } = await uploadImageToSupabase(compressedBuffer, fileName);
    console.log(`Upload successful: ${url}`);

    // Get old photo URL to delete from Supabase
    const [oldGoat] = await sql`
      SELECT photo_url FROM goats WHERE goat_id = ${goatId}
    `;

    // Update goat record with Supabase public URL
    const result = await sql`
      UPDATE goats 
      SET photo_url = ${url},
          updated_at = CURRENT_TIMESTAMP
      WHERE goat_id = ${goatId}
      RETURNING *
    `;

    if (result.length === 0) {
      console.error(`Goat ${goatId} not found in database`);
      return res.status(404).json({ error: 'Goat not found' });
    }

    console.log(`Database updated for goat ${goatId}`);

    // Delete old photo from Supabase if it exists
    if (oldGoat && oldGoat.photo_url && oldGoat.photo_url.includes('supabase')) {
      const oldPath = oldGoat.photo_url.split('/').slice(-2).join('/');
      console.log(`Deleting old photo: ${oldPath}`);
      await deleteImageFromSupabase(oldPath);
    }

    res.json({
      message: 'Photo uploaded successfully',
      photoUrl: url,
      originalSize: req.file.size,
      compressedSize: compressedBuffer.length,
      compressionRatio: `${((1 - compressedBuffer.length / req.file.size) * 100).toFixed(2)}%`,
      goat: result[0]
    });
  } catch (error) {
    console.error('❌ Error uploading goat photo:', {
      message: error.message,
      stack: error.stack,
      goatId: req.params.id,
      hasFile: !!req.file
    });
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
});

/**
 * POST /api/upload/document
 * Upload general document (for PDFs/docs - stores as base64)
 */
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert document to base64
    const base64String = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const base64Document = `data:${mimeType};base64,${base64String}`;

    res.json({
      message: 'Document uploaded successfully',
      documentData: base64Document,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/upload/goat-photo/:id
 * Get photo URL for a specific goat
 */
router.get('/goat-photo/:id', async (req, res) => {
  try {
    const goatId = req.params.id;

    const result = await sql`
      SELECT photo_url FROM goats WHERE goat_id = ${goatId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    res.json({ photoUrl: result[0].photo_url });
  } catch (error) {
    console.error('Error fetching goat photo:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/upload/goat-photo/:id
 * Delete photo for a specific goat
 */
router.delete('/goat-photo/:id', async (req, res) => {
  try {
    const goatId = req.params.id;

    // Get current goat
    const [goat] = await sql`
      SELECT photo_url FROM goats WHERE goat_id = ${goatId}
    `;

    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    // Delete from Supabase Storage if it exists
    if (goat.photo_url && goat.photo_url.includes('supabase')) {
      const filePath = goat.photo_url.split('/').slice(-2).join('/');
      await deleteImageFromSupabase(filePath);
    }

    // Remove photo URL from database
    await sql`
      UPDATE goats 
      SET photo_url = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE goat_id = ${goatId}
    `;

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting goat photo:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/upload/profile-photo
 * Upload or update user's profile photo (stores in Supabase Storage)
 */
router.post('/profile-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Compress image
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const fileName = `profiles/${req.user.userId}-${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { url, path } = await uploadImageToSupabase(compressedBuffer, fileName);

    // Get old profile photo
    const [oldUser] = await sql`
      SELECT profile_photo FROM users WHERE user_id = ${req.user.userId}
    `;

    // Update user record with Supabase public URL
    const result = await sql`
      UPDATE users 
      SET profile_photo = ${url},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${req.user.userId}
      RETURNING user_id, email, full_name, role, profile_photo
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old photo from Supabase if it exists
    if (oldUser && oldUser.profile_photo && oldUser.profile_photo.includes('supabase')) {
      const oldPath = oldUser.profile_photo.split('/').slice(-2).join('/');
      await deleteImageFromSupabase(oldPath);
    }

    res.json({
      message: 'Profile photo uploaded successfully',
      photoUrl: url,
      originalSize: req.file.size,
      compressedSize: compressedBuffer.length,
      compressionRatio: `${((1 - compressedBuffer.length / req.file.size) * 100).toFixed(2)}%`,
      user: result[0]
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/upload/profile-photo
 * Delete user's profile photo
 */
router.delete('/profile-photo', async (req, res) => {
  try {
    // Get current profile photo
    const [user] = await sql`
      SELECT profile_photo FROM users WHERE user_id = ${req.user.userId}
    `;

    if (!user || !user.profile_photo) {
      return res.status(404).json({ error: 'No profile photo found' });
    }

    // Delete from Supabase Storage
    if (user.profile_photo.includes('supabase')) {
      const filePath = user.profile_photo.split('/').slice(-2).join('/');
      await deleteImageFromSupabase(filePath);
    }

    // Remove photo URL from database
    await sql`
      UPDATE users 
      SET profile_photo = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${req.user.userId}
    `;

    res.json({ message: 'Profile photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
