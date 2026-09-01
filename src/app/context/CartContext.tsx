import { createContext, useContext, useState, ReactNode } from 'react';
import { type Product } from '../../config/api';
import { metaPixelEvents } from '../../config/metaPixel';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === productId);
      if (existing) {
        // Tracker AddToCart pour produit existant (augmentation quantité)
        const productIdStr = String(productId);
        metaPixelEvents.addToCart(product.name, productIdStr, product.price, 1);
        
        return prev.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Tracker AddToCart pour nouveau produit
      const productIdStr = String(productId);
      metaPixelEvents.addToCart(product.name, productIdStr, product.price, 1);

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    setCart((prev) => {
      if (quantity < 1) {
        return prev.filter((item) => (item._id || item.id) !== productId);
      }

      return prev.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
