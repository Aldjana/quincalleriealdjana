import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

export interface StoredProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  rating: number;
  stock?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultProducts: Omit<StoredProduct, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Perceuse sans fil Makita',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=85',
    ],
    category: 'Outils électriques',
    description: 'Perceuse professionnelle sans fil avec batterie haute capacité.',
    rating: 4.5,
    stock: 15,
    featured: true,
  },
  {
    name: 'Marteau de charpentier',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572981779307-38bfe651ed0b?auto=format&fit=crop&w=1200&q=85',
    ],
    category: 'Outils manuels',
    description: 'Marteau de charpentier Stanley avec manche en hêtre.',
    rating: 4.8,
    stock: 25,
    featured: false,
  },
  {
    name: 'Scie sauteuse',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85',
    ],
    category: 'Outils électriques',
    description: 'Scie sauteuse professionnelle avec moteur puissant.',
    rating: 4.7,
    stock: 8,
    featured: false,
  },
];

async function ensureDataFile(): Promise<StoredProduct[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as StoredProduct[];
  } catch {
    const now = new Date().toISOString();
    const seeded = defaultProducts.map((p, i) => ({
      ...p,
      _id: `local_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    }));
    await fs.writeFile(DATA_FILE, JSON.stringify(seeded, null, 2), 'utf-8');
    return seeded;
  }
}

async function readAll(): Promise<StoredProduct[]> {
  return ensureDataFile();
}

async function writeAll(products: StoredProduct[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export const fileStore = {
  getAll: async (): Promise<StoredProduct[]> => {
    const products = await readAll();
    return products.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: string): Promise<StoredProduct | null> => {
    const products = await readAll();
    return products.find((p) => p._id === id) ?? null;
  },

  create: async (
    data: Omit<StoredProduct, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<StoredProduct> => {
    const products = await readAll();
    const now = new Date().toISOString();
    const product: StoredProduct = {
      ...data,
      _id: `local_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    products.unshift(product);
    await writeAll(products);
    return product;
  },

  update: async (
    id: string,
    data: Partial<Omit<StoredProduct, '_id' | 'createdAt'>>
  ): Promise<StoredProduct | null> => {
    const products = await readAll();
    const index = products.findIndex((p) => p._id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await writeAll(products);
    return products[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const products = await readAll();
    const filtered = products.filter((p) => p._id !== id);
    if (filtered.length === products.length) return false;
    await writeAll(filtered);
    return true;
  },
};
