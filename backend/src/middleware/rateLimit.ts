import type { NextFunction, Request, Response } from 'express';

// Render passe par Cloudflare : sans cet en-tête, tous les visiteurs pourraient
// partager la même IP (celle du proxy) et se bloquer mutuellement.
function clientKey(req: Request): string {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp) return cfIp;
  return req.ip ?? 'unknown';
}

interface Bucket {
  count: number;
  resetAt: number;
}

// Limiteur en mémoire, suffisant pour une seule instance (Render free).
export function rateLimit({ windowMs, max }: { windowMs: number; max: number }) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = clientKey(req);
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    // Nettoyage opportuniste des entrées expirées
    if (buckets.size > 1000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }

    if (bucket.count > max) {
      res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
      return res.status(429).json({
        success: false,
        message: 'Trop de tentatives. Réessayez dans quelques minutes.',
      });
    }
    next();
  };
}
