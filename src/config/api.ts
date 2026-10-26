export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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

export const getProductId = (product: Product): string => String(product._id ?? product.id ?? '');

// --- Session admin ---------------------------------------------------------

const ADMIN_TOKEN_KEY = 'adminToken';
export const ADMIN_UNAUTHORIZED_EVENT = 'admin:unauthorized';

export const adminSession = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string) => {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {
      /* stockage indisponible : la session ne survivra pas au rechargement */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(
  path: string,
  { auth = false, ...init }: RequestInit & { auth?: boolean } = {},
  fallbackMessage = 'Erreur réseau'
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (auth) {
    const token = adminSession.getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    if (auth && response.status === 401) {
      adminSession.clear();
      window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
    }
    throw new ApiError(data?.error || data?.message || fallbackMessage, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// --- Produits --------------------------------------------------------------

export const productsAPI = {
  getAll: (options: { fresh?: boolean } = {}) =>
    request<Product[]>(
      '/api/products',
      options.fresh ? { cache: 'no-store' } : {},
      'Erreur lors de la récupération des produits'
    ),

  getById: (id: string) => request<Product>(`/api/products/${encodeURIComponent(id)}`, {}, 'Produit introuvable'),

  create: (product: Omit<Product, '_id' | 'id'>) =>
    request<Product>(
      '/api/products',
      { method: 'POST', body: JSON.stringify(product), auth: true },
      'Erreur lors de la création du produit'
    ),

  update: (id: string, product: Partial<Product>) =>
    request<Product>(
      `/api/products/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(product), auth: true },
      'Erreur lors de la mise à jour du produit'
    ),

  delete: (id: string) =>
    request<void>(
      `/api/products/${encodeURIComponent(id)}`,
      { method: 'DELETE', auth: true },
      'Erreur lors de la suppression du produit'
    ),
};

// --- Authentification & upload --------------------------------------------

export const authAPI = {
  login: (email: string, password: string) =>
    request<{ success: boolean; token: string }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      'Email ou mot de passe incorrect'
    ),

  verify: () => request<{ success: boolean }>('/api/auth/verify', { auth: true }, 'Session expirée'),
};

export const uploadAPI = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const data = await request<{ imageUrl: string }>(
      '/api/upload/single',
      { method: 'POST', body: formData, auth: true },
      "Erreur lors de l'upload"
    );
    return data.imageUrl;
  },
};

// --- Commandes -------------------------------------------------------------

export type OrderStatus = 'nouvelle' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: { name: string; phone: string; address: string; note?: string };
  total: number;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewOrder {
  customer: { name: string; phone: string; address: string; note?: string };
  items: { productId: string; quantity: number }[];
}

export const ordersAPI = {
  create: (order: NewOrder) =>
    request<Pick<Order, '_id' | 'orderNumber' | 'items' | 'total' | 'createdAt'>>(
      '/api/orders',
      { method: 'POST', body: JSON.stringify(order) },
      "Impossible d'enregistrer la commande"
    ),

  list: () => request<Order[]>('/api/orders', { auth: true, cache: 'no-store' }, 'Impossible de charger les commandes'),

  update: (id: string, data: { status?: OrderStatus; adminNote?: string }) =>
    request<Order>(
      `/api/orders/${encodeURIComponent(id)}`,
      { method: 'PATCH', body: JSON.stringify(data), auth: true },
      'Impossible de mettre à jour la commande'
    ),

  delete: (id: string) =>
    request<void>(`/api/orders/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }, 'Suppression impossible'),
};

// --- Messages de contact ---------------------------------------------------

export interface ContactMessage {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type NewContactMessage = Pick<ContactMessage, 'name' | 'phone' | 'email' | 'subject' | 'message'>;

export const messagesAPI = {
  send: (message: NewContactMessage) =>
    request<{ success: boolean }>(
      '/api/messages',
      { method: 'POST', body: JSON.stringify(message) },
      "Impossible d'envoyer le message"
    ),

  list: () =>
    request<ContactMessage[]>('/api/messages', { auth: true, cache: 'no-store' }, 'Impossible de charger les messages'),

  markRead: (id: string, read: boolean) =>
    request<ContactMessage>(
      `/api/messages/${encodeURIComponent(id)}`,
      { method: 'PATCH', body: JSON.stringify({ read }), auth: true },
      'Mise à jour impossible'
    ),

  delete: (id: string) =>
    request<void>(`/api/messages/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }, 'Suppression impossible'),
};
