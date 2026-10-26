import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProductId, type Product } from '../../config/api';
import { metaPixelEvents } from '../../config/metaPixel';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
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

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* stockage indisponible */
    }
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    const productId = getProductId(product);
    // Tracking hors du setState : React peut rejouer la fonction de mise à jour
    metaPixelEvents.addToCart(product.name, productId, product.price, 1);

    setCart((prev) => {
      const existing = prev.find((item) => getProductId(item) === productId);
      if (existing) {
        return prev.map((item) =>
          getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
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
