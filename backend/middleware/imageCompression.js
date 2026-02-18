import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Middleware to compress uploaded images
 * Reduces file size while maintaining quality
 */
const compressImage = async (req, res, next) => {
  try {
    // Only process if file was uploaded
    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return next();
    }

    const inputPath = req.file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), '-compressed.jpg');

    // Compress image
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true // Don't upscale small images
      })
      .jpeg({
        quality: 80, // 80% quality - good balance between size and quality
        progressive: true,
        mozjpeg: true // Better compression
      })
      .toFile(outputPath);

    // Get compressed file stats
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ Image compressed: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${compressionRatio}% reduction)`);

    // Delete original file
    fs.unlinkSync(inputPath);

    // Update req.file to point to compressed file
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    req.file.size = compressedSize;
    req.file.compressionRatio = compressionRatio;

    next();
  } catch (error) {
    console.error('Image compression error:', error);
    // Continue even if compression fails
    next();
  }
};

/**
 * Create thumbnail for images
 */
const createThumbnail = async (filePath, thumbnailSize = 200) => {
  try {
    const thumbnailPath = filePath.replace(path.extname(filePath), '-thumb.jpg');

    await sharp(filePath)
      .resize(thumbnailSize, thumbnailSize, {
        fit: 'cover'
      })
      .jpeg({
        quality: 70
      })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    console.error('Thumbnail creation error:', error);
    return null;
  }
};

/**
 * Validate image file
 */
const validateImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      valid: true,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

/**
 * Convert image to WebP format for better compression
 */
const convertToWebP = async (filePath) => {
  try {
    const webpPath = filePath.replace(path.extname(filePath), '.webp');

    await sharp(filePath)
      .webp({
        quality: 80,
        effort: 4 // Compression effort (0-6, higher = better but slower)
      })
      .toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;

    // Use WebP if it's significantly smaller
    if (webpSize < originalSize * 0.8) {
      fs.unlinkSync(filePath);
      return webpPath;
    } else {
      fs.unlinkSync(webpPath);
      return filePath;
    }
  } catch (error) {
    console.error('WebP conversion error:', error);
    return filePath;
  }
};

export { compressImage, createThumbnail, validateImage, convertToWebP };
export default compressImage;
