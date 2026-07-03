import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import { connectDatabase, getStorageMode } from './db/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;
const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/ma-boutique';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/products', productsRouter);

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
