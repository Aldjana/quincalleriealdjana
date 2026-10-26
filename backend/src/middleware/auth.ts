import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@quincaillerie.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };
}

// Secret de signature : JWT_SECRET si défini, sinon dérivé des identifiants admin
// (changer le mot de passe admin invalide donc toutes les sessions existantes).
function getSigningSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const { email, password } = getAdminCredentials();
  return crypto.createHash('sha256').update(`${email}:${password}:ma-boutique`).digest('hex');
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSigningSecret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function checkAdminCredentials(email: unknown, password: unknown): boolean {
  if (typeof email !== 'string' || typeof password !== 'string') return false;
  const admin = getAdminCredentials();
  // Les deux comparaisons sont toujours évaluées pour ne pas révéler laquelle échoue
  const emailOk = safeEqual(email.trim().toLowerCase(), admin.email.toLowerCase());
  const passwordOk = safeEqual(password, admin.password);
  return emailOk && passwordOk;
}

export function createAdminToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ sub: 'admin', exp: expiresAt })).toString('base64url');
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;

  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return sub === 'admin' && typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }
  next();
}
