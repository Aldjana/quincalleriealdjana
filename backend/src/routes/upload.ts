import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration du stockage en mémoire (pour Cloudinary)
const storage = multer.memoryStorage();

// Filtre pour accepter uniquement les images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Endpoint pour uploader une seule image
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'ma-boutique/products',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 800, crop: 'limit' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Erreur Cloudinary:', error);
          return res.status(500).json({ error: 'Erreur lors de l\'upload' });
        }
        
        if (!result) {
          return res.status(500).json({ error: 'Erreur lors de l\'upload' });
        }

        res.json({ 
          imageUrl: result.secure_url, 
          publicId: result.public_id,
          filename: req.file?.originalname 
        });
      }
    );

    // Envoyer le buffer vers Cloudinary
    result.end(req.file.buffer);
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

// Endpoint pour uploader plusieurs images
router.post('/multiple', upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const uploadPromises = req.files.map((file: any) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'ma-boutique/products',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 800, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error('Upload failed'));
            } else {
              resolve({
                imageUrl: result.secure_url,
                publicId: result.public_id,
                filename: file.originalname
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    res.json({ 
      imageUrls: results.map((r: any) => r.imageUrl),
      publicIds: results.map((r: any) => r.publicId),
      filenames: results.map((r: any) => r.filename)
    });
  } catch (error) {
    console.error('Erreur upload multiple:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

export default router;
