import { Router } from 'express';
import { checkAdminCredentials, createAdminToken, requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
  const { email, password } = req.body ?? {};

  if (!checkAdminCredentials(email, password)) {
    return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  }

  const { token, expiresAt } = createAdminToken();
  res.json({ success: true, token, expiresAt });
});

// Permet au dashboard de vérifier qu'une session stockée est toujours valide
router.get('/verify', requireAdmin, (_req, res) => {
  res.json({ success: true });
});

export default router;
