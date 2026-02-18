import sharp from 'sharp';

/**
 * Middleware to convert uploaded images to base64 and compress them
 * This approach stores images directly in the database (no filesystem dependency)
 * Perfect for deployment on Render/Vercel
 */

const convertToBase64 = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Only process images
    if (!mimeType.startsWith('image/')) {
      req.base64Image = null;
      return next();
    }

    // Compress and resize image using sharp
    const processedBuffer = await sharp(fileBuffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert to base64
    const base64String = processedBuffer.toString('base64');
    const base64Image = `data:image/jpeg;base64,${base64String}`;

    // Store in request object
    req.base64Image = base64Image;
    req.originalSize = fileBuffer.length;
    req.compressedSize = processedBuffer.length;
    req.compressionRatio = ((1 - processedBuffer.length / fileBuffer.length) * 100).toFixed(2);

    next();
  } catch (error) {
    console.error('Error converting image to base64:', error);
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message 
    });
  }
};

/**
 * Create thumbnail version of image
 */
const createThumbnailBase64 = async (buffer, mimeType) => {
  try {
    if (!mimeType.startsWith('image/')) {
      return null;
    }

    const thumbnailBuffer = await sharp(buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toBuffer();

    const base64String = thumbnailBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return null;
  }
};

export { convertToBase64, createThumbnailBase64 };
export default convertToBase64;
