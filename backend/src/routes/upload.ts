import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seuls les fichiers image sont autorisés'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

interface UploadResult {
  imageUrl: string;
  publicId: string;
  filename: string;
}

function uploadToCloudinary(file: Express.Multer.File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'ma-boutique/products',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }, { width: 800, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload échoué'));
        resolve({ imageUrl: result.secure_url, publicId: result.public_id, filename: file.originalname });
      }
    );
    stream.end(file.buffer);
  });
}

// Transforme les erreurs multer (taille, type) en réponse JSON lisible
function handleMulter(middleware: ReturnType<typeof upload.single>) {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err?: unknown) => {
      if (!err) return next();
      const message =
        err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
          ? 'Image trop lourde (5 Mo maximum).'
          : err instanceof Error
            ? err.message
            : "Erreur lors de l'upload";
      res.status(400).json({ error: message });
    });
  };
}

router.post('/single', requireAdmin, handleMulter(upload.single('image')), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier uploadé' });

  try {
    res.json(await uploadToCloudinary(req.file));
  } catch (error) {
    console.error('Erreur Cloudinary:', error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
});

router.post('/multiple', requireAdmin, handleMulter(upload.array('images', 6)), async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length === 0) return res.status(400).json({ error: 'Aucun fichier uploadé' });

  try {
    const results = await Promise.all(files.map(uploadToCloudinary));
    res.json({
      imageUrls: results.map((r) => r.imageUrl),
      publicIds: results.map((r) => r.publicId),
      filenames: results.map((r) => r.filename),
    });
  } catch (error) {
    console.error('Erreur upload multiple:', error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
});

export default router;
