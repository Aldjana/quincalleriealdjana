import { Router } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireDatabase } from '../middleware/requireDatabase.js';
import { cleanEmail, cleanPhone, cleanText } from '../utils/text.js';

const router = Router();
router.use(requireDatabase);

router.post('/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), async (req, res) => {
  try {
    const body = req.body ?? {};
    const name = cleanText(body.name, { min: 2, max: 100 });
    const phone = cleanPhone(body.phone);
    const email = cleanEmail(body.email);
    const subject = cleanText(body.subject, { max: 150 });
    const message = cleanText(body.message, { min: 5, max: 2000 });

    if (!name) return res.status(400).json({ error: 'Nom invalide.' });
    if (!phone) return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    if (email === null) return res.status(400).json({ error: 'Adresse email invalide.' });
    if (subject === null) return res.status(400).json({ error: 'Sujet trop long.' });
    if (!message) return res.status(400).json({ error: 'Le message doit contenir entre 5 et 2000 caractères.' });

    await Message.create({ name, phone, email, subject, message });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Erreur POST /api/messages', error);
    res.status(500).json({ error: "Impossible d'envoyer le message." });
  }
});

router.get('/', requireAdmin, async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(500).lean();
    res.set('Cache-Control', 'no-store').json(messages);
  } catch (error) {
    console.error('Erreur GET /api/messages', error);
    res.status(500).json({ error: 'Impossible de récupérer les messages.' });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Message introuvable.' });
    const updated = await Message.findByIdAndUpdate(req.params.id, { read: Boolean(req.body?.read) }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Message introuvable.' });
    res.json(updated);
  } catch (error) {
    console.error('Erreur PATCH /api/messages/:id', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le message.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Message introuvable.' });
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message introuvable.' });
    res.json({ message: 'Message supprimé.' });
  } catch (error) {
    console.error('Erreur DELETE /api/messages/:id', error);
    res.status(500).json({ error: 'Impossible de supprimer le message.' });
  }
});

export default router;
