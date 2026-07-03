import { Router } from 'express';
import Product from '../models/Product.js';
import { isUsingFileStore } from '../db/connection.js';
import { fileStore } from '../store/fileStore.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    if (isUsingFileStore()) {
      return res.json(await fileStore.getAll());
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Erreur GET /api/products', error);
    res.status(500).json({ error: 'Impossible de récupérer les produits.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isUsingFileStore()) {
      const product = await fileStore.getById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
      return res.json(product);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erreur GET /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de récupérer le produit.' });
  }
});

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1581093616143-1b29f99148d6?auto=format&fit=crop&w=800&q=85';

function normalizeProductImages(body: { image?: string; images?: string[] }) {
  const images = (body.images?.length ? body.images : body.image ? [body.image] : [])
    .map((url) => url?.trim())
    .filter(Boolean) as string[];

  const resolved = images.length > 0 ? images : [DEFAULT_IMAGE];
  return { image: resolved[0], images: resolved };
}

router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, rating, description, featured } = req.body;
    if (!name?.trim() || !category?.trim() || price == null || Number.isNaN(price)) {
      return res.status(400).json({ error: 'name, category et price sont obligatoires.' });
    }

    const { image, images } = normalizeProductImages(req.body);

    const payload = {
      name,
      category,
      price,
      stock: stock ?? 0,
      rating: rating ?? 4.5,
      image,
      images,
      description: description || '',
      featured: featured ?? false,
    };

    if (isUsingFileStore()) {
      const saved = await fileStore.create(payload);
      return res.status(201).json(saved);
    }

    const newProduct = new Product(payload);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Erreur POST /api/products', error);
    res.status(500).json({ error: 'Impossible de créer le produit.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (isUsingFileStore()) {
      const updated = await fileStore.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Produit introuvable.' });
      return res.json(updated);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Erreur PUT /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le produit.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (isUsingFileStore()) {
      const deleted = await fileStore.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Produit introuvable.' });
      return res.json({ message: 'Produit supprimé.' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }
    res.json({ message: 'Produit supprimé.' });
  } catch (error) {
    console.error('Erreur DELETE /api/products/:id', error);
    res.status(500).json({ error: 'Impossible de supprimer le produit.' });
  }
});

export default router;
