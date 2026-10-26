import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import ordersRouter from './routes/orders.js';
import messagesRouter from './routes/messages.js';
import { connectDatabase, getStorageMode } from './db/connection.js';

const app = express();
const PORT = process.env.PORT ?? 4000;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/ma-boutique';

// Render place l'application derrière un proxy : nécessaire pour obtenir la vraie IP client
app.set('trust proxy', 1);
app.disable('x-powered-by');

// CORS_ORIGINS="https://site1,https://site2" pour restreindre ; ouvert par défaut.
// Les routes d'écriture sont protégées par jeton Bearer, pas par cookie.
const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined));

app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/messages', messagesRouter);

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend Ma Boutique fonctionne',
    storage: getStorageMode(),
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable.' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number; type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON invalide.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Requête trop volumineuse.' });
  console.error('Erreur non gérée', err);
  res.status(err.status ?? 500).json({ error: 'Erreur serveur.' });
});

connectDatabase(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Stockage : ${getStorageMode() === 'mongodb' ? 'MongoDB' : 'fichier local'}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.warn('⚠️  ADMIN_PASSWORD non défini : mot de passe admin par défaut utilisé.');
    }
  });
});
