const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Product {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  rating: number;
  stock?: number;
  featured?: boolean;
}

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
    return response.json();
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Produit introuvable');
    return response.json();
  },

  create: async (product: Omit<Product, '_id' | 'id'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || 'Erreur lors de la création du produit');
    }
    return response.json();
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || 'Erreur lors de la mise à jour du produit');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || 'Erreur lors de la suppression du produit');
    }
  },
};
