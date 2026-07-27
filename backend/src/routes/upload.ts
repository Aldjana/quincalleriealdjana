import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Récupérer l'URL de base depuis l'environnement ou utiliser l'URL de la requête
const getBaseUrl = (req: any) => {
  const envUrl = process.env.BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  return `${req.protocol}://${req.get('host')}`;
};

// Configuration du stockage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/images');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

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
router.post('/single', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' });
  }
  
  const baseUrl = getBaseUrl(req);
  const imageUrl = `/images/${req.file.filename}`;
  const fullImageUrl = `${baseUrl}${imageUrl}`;
  res.json({ imageUrl: fullImageUrl, filename: req.file.filename });
});

// Endpoint pour uploader plusieurs images
router.post('/multiple', upload.array('images', 6), (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' });
  }
  
  const baseUrl = getBaseUrl(req);
  const imageUrls = req.files.map((file: any) => {
    const imageUrl = `/images/${file.filename}`;
    return `${baseUrl}${imageUrl}`;
  });
  res.json({ imageUrls, filenames: req.files.map((f: any) => f.filename) });
});

export default router;
