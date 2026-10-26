import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProductId, type Product } from '../../config/api';
import { metaPixelEvents } from '../../config/metaPixel';
import { useProducts } from '../../hooks/useProducts';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CART_STORAGE_KEY = 'cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Le panier survit au rechargement de la page
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // Aligne le panier sur le catalogue à jour : prix modifiés, produits supprimés
  const { products, isFresh } = useProducts();
  useEffect(() => {
    if (!isFresh) return;
    const catalog = new Map(products.map((p) => [getProductId(p), p]));
    setCart((prev) => {
      let changed = false;
      const next = prev.flatMap((item) => {
        const current = catalog.get(getProductId(item));
        if (!current) {
          changed = true;
          return [];
        }
        if (current.price !== item.price || current.name !== item.name || current.image !== item.image) {
          changed = true;
          return [{ ...item, ...current, quantity: item.quantity }];
        }
        return [item];
      });
      return changed ? next : prev;
    });
  }, [products, isFresh]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* stockage indisponible */
    }
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const productId = getProductId(product);
    // Tracking hors du setState : React peut rejouer la fonction de mise à jour
    metaPixelEvents.addToCart(product.name, productId, product.price, quantity);

    setCart((prev) => {
      const existing = prev.find((item) => getProductId(item) === productId);
      if (existing) {
        return prev.map((item) =>
          getProductId(item) === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string | number) => {
    const id = String(productId);
    setCart((prev) => prev.filter((item) => getProductId(item) !== id));
  }, []);

  const updateQuantity = useCallback((productId: string | number, quantity: number) => {
    const id = String(productId);
    setCart((prev) =>
      quantity < 1
        ? prev.filter((item) => getProductId(item) !== id)
        : prev.map((item) => (getProductId(item) === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(() => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return {
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      getTotalItems: () => totalItems,
      getTotalPrice: () => totalPrice,
    };
  }, [cart, addToCart, removeFromCart, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
