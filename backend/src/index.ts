import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import { connectDatabase, getStorageMode } from './db/connection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 4000;
const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/ma-boutique';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend Ma Boutique fonctionne',
    storage: getStorageMode(),
  });
});

connectDatabase(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Stockage : ${getStorageMode() === 'mongodb' ? 'MongoDB' : 'fichier local'}`);
  });
});
