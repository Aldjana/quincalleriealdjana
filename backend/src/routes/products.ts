import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { isUsingFileStore } from '../db/connection.js';
import { fileStore } from '../store/fileStore.js';
import { requireAdmin } from '../middleware/auth.js';
import { parseProductInput, type ProductInput } from '../utils/productInput.js';

const router = Router();

// Cache court côté navigateur/CDN : la boutique reste réactive sans surcharger le serveur
const PUBLIC_CACHE = 'public, max-age=60, stale-while-revalidate=300';

function isValidId(id: string): boolean {
  return isUsingFileStore() ? id.length > 0 : mongoose.isValidObjectId(id);
}

// Les produits désactivés (active: false) sont masqués de la boutique.
// Les anciens produits sans le champ `active` restent visibles.
const isActive = (product: { active?: boolean }) => product.active !== false;

async function listProducts() {
  return isUsingFileStore() ? fileStore.getAll() : Product.find().sort({ createdAt: -1 }).lean();
}

router.get('/', async (_req, res) => {
  try {
    const products = (await listProducts()).filter(isActive);
    res.set('Cache-Control', PUBLIC_CACHE).json(products);
  } catch (error) {
    console.error('Erreur GET /api/products', error);
    res.status(500).json({ error: 'Impossible de récupérer les produits.' });
  }
});

// Catalogue complet pour l'admin, produits désactivés compris
router.get('/admin/all', requireAdmin, async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store').json(await listProducts());
  } catch (error) {
    console.error('Erreur GET /api/products/admin/all', error);
    res.status(500).json({ error: 'Impossible de récupérer les produits.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(404).json({ error: 'Produit introuvable.' });

    const product = isUsingFileStore() ? await fileStore.getById(id) : await Product.findById(id).lean();
    if (!product || !isActive(product)) return res.status(404).json({ error: 'Produit introuvable.' });

    res.set('Cache-Control', PUBLIC_CACHE).json(product);
  } catch (error) {
    console.error('Erreur GET /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de récupérer le produit.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const parsed = parseProductInput(req.body, { partial: false });
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });

    const payload = parsed.data as Required<ProductInput>;
    const saved = isUsingFileStore() ? await fileStore.create(payload) : await Product.create(payload);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Erreur POST /api/products', error);
    res.status(500).json({ error: 'Impossible de créer le produit.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(404).json({ error: 'Produit introuvable.' });

    const parsed = parseProductInput(req.body, { partial: true });
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });

    const updated = isUsingFileStore()
      ? await fileStore.update(id, parsed.data)
      : await Product.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }).lean();

    if (!updated) return res.status(404).json({ error: 'Produit introuvable.' });
    res.json(updated);
  } catch (error) {
    console.error('Erreur PUT /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le produit.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(404).json({ error: 'Produit introuvable.' });

    const deleted = isUsingFileStore() ? await fileStore.delete(id) : await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Produit introuvable.' });

    res.json({ message: 'Produit supprimé.' });
  } catch (error) {
    console.error('Erreur DELETE /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de supprimer le produit.' });
  }
});

export default router;
