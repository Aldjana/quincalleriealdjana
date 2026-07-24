import express from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@quincaillerie.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    const token = 'token_' + crypto.randomBytes(16).toString('hex');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  }
});

export default router;
