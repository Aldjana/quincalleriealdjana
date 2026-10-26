import type { NextFunction, Request, Response } from 'express';
import { isUsingFileStore } from '../db/connection.js';

// Commandes et messages ne sont stockés que dans MongoDB (pas de stockage de secours sur fichier)
export function requireDatabase(_req: Request, res: Response, next: NextFunction) {
  if (isUsingFileStore()) {
    return res.status(503).json({ error: 'Base de données indisponible pour le moment.' });
  }
  next();
}
