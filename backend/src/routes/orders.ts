import crypto from 'crypto';
import { Router } from 'express';
import mongoose from 'mongoose';
import Order, { ORDER_STATUSES, type OrderItem, type OrderStatus } from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireDatabase } from '../middleware/requireDatabase.js';
import { cleanPhone, cleanText } from '../utils/text.js';

const router = Router();
router.use(requireDatabase);

function generateOrderNumber(): string {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `CMD-${date}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

// Création publique : les prix et noms sont relus en base, jamais pris du navigateur
router.post('/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {
  try {
    const body = req.body ?? {};
    const customer = {
      name: cleanText(body.customer?.name, { min: 2, max: 100 }),
      phone: cleanPhone(body.customer?.phone),
      address: cleanText(body.customer?.address, { min: 3, max: 300 }),
      note: cleanText(body.customer?.note, { max: 500 }),
    };
    if (!customer.name) return res.status(400).json({ error: 'Nom invalide.' });
    if (!customer.phone) return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    if (!customer.address) return res.status(400).json({ error: 'Adresse invalide.' });
    if (customer.note === null) return res.status(400).json({ error: 'Note trop longue (500 caractères max).' });

    const rawItems: unknown[] = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0 || rawItems.length > 50) {
      return res.status(400).json({ error: 'La commande doit contenir entre 1 et 50 produits.' });
    }

    // Regroupe les quantités par produit
    const quantities = new Map<string, number>();
    for (const raw of rawItems) {
      const item = raw as { productId?: unknown; quantity?: unknown };
      const id = typeof item.productId === 'string' ? item.productId : '';
      const qty = Number(item.quantity);
      if (!mongoose.isValidObjectId(id) || !Number.isInteger(qty) || qty < 1 || qty > 999) {
        return res.status(400).json({ error: 'Produit ou quantité invalide.' });
      }
      quantities.set(id, (quantities.get(id) ?? 0) + qty);
    }

    const products = await Product.find({ _id: { $in: [...quantities.keys()] } }).lean();
    if (products.length !== quantities.size) {
      return res.status(409).json({ error: "Un produit de votre panier n'est plus disponible. Actualisez la page." });
    }

    const items: OrderItem[] = products.map((p) => ({
      product: String(p._id),
      name: p.name,
      price: p.price,
      quantity: quantities.get(String(p._id))!,
      image: p.image,
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      items,
      customer,
      total,
    });

    res.status(201).json({
      _id: order._id,
      orderNumber: order.orderNumber,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Erreur POST /api/orders', error);
    res.status(500).json({ error: "Impossible d'enregistrer la commande." });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const filter = ORDER_STATUSES.includes(status as OrderStatus) ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    res.set('Cache-Control', 'no-store').json(orders);
  } catch (error) {
    console.error('Erreur GET /api/orders', error);
    res.status(500).json({ error: 'Impossible de récupérer les commandes.' });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Commande introuvable.' });

    const update: { status?: OrderStatus; adminNote?: string } = {};
    if (req.body?.status !== undefined) {
      if (!ORDER_STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Statut invalide.' });
      update.status = req.body.status;
    }
    if (req.body?.adminNote !== undefined) {
      const note = cleanText(req.body.adminNote, { max: 1000 });
      if (note === null) return res.status(400).json({ error: 'Note invalide.' });
      update.adminNote = note;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' });
    res.json(order);
  } catch (error) {
    console.error('Erreur PATCH /api/orders/:id', error);
    res.status(500).json({ error: 'Impossible de mettre à jour la commande.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Commande introuvable.' });
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Commande introuvable.' });
    res.json({ message: 'Commande supprimée.' });
  } catch (error) {
    console.error('Erreur DELETE /api/orders/:id', error);
    res.status(500).json({ error: 'Impossible de supprimer la commande.' });
  }
});

export default router;
