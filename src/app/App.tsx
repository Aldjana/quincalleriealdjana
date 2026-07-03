import { useState, useEffect } from 'react';
import { productsAPI, type Product } from '../config/api';

// Import des composants
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductsSection } from './components/ProductsSection';
import { Footer } from './components/Footer';

// Import des pages
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';

// Types
interface CartItem extends Product {
  quantity: number;
}

// Produits par défaut
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Perceuse sans fil Makita',
    price: 25000,
    image:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Perceuse professionnelle sans fil avec batterie haute capacité.',
    rating: 4.5,
    stock: 15,
    featured: true
  },
  {
    id: 2,
    name: 'Marteau de charpentier',
    price: 8500,
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=85',
    category: 'Outils manuels',
    description: 'Marteau de charpentier Stanley avec manche en hêtre.',
    rating: 4.8,
    stock: 25,
    featured: false
  },
  {
    id: 3,
    name: 'Scie sauteuse',
    price: 32000,
    image:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Scie sauteuse professionnelle avec moteur puissant.',
    rating: 4.7,
    stock: 8,
    featured: false
  },
  {
    id: 4,
    name: 'Rabot électrique',
    price: 38000,
    image:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Rabot électrique professionnel pour travaux de finition.',
    rating: 4.6,
    stock: 12,
    featured: false
  },
  {
    id: 5,
    name: 'Ensemble de clés',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=85',
    category: 'Outils manuels',
    description: 'Ensemble complet de clés mixtes avec coffret de rangement.',
    rating: 4.3,
    stock: 30,
    featured: false
  },
  {
    id: 6,
    name: 'Perceuse à colonne',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Perceuse à colonne professionnelle avec guide de précision.',
    rating: 4.9,
    stock: 6,
    featured: true
  },
  {
    id: 7,
    name: 'Niveau à bulle',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=85',
    category: 'Mesure',
    description: 'Niveau à bulle de précision avec aimants magnétiques.',
    rating: 4.4,
    stock: 20,
    featured: false
  },
  {
    id: 8,
    name: 'Coffret à outils',
    price: 22000,
    image:
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85',
    category: 'Rangement',
    description: 'Coffret à outils en métal avec compartiments organisés.',
    rating: 4.2,
    stock: 15,
    featured: false
  },
  {
    id: 9,
    name: 'Meuleuse d\'angle',
    price: 18000,
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Meuleuse d\'angle avec disques abrasifs.',
    rating: 4.1,
    stock: 10,
    featured: false
  },
  {
    id: 10,
    name: 'Pistolet à colle chaude',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=85',
    category: 'Outils manuels',
    description: 'Pistolet à colle chaude professionnel pour travaux de précision.',
    rating: 3.9,
    stock: 25,
    featured: false
  },
  {
    id: 11,
    name: 'Clé à choc pneumatique',
    price: 28000,
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85',
    category: 'Outils pneumatiques',
    description: 'Clé à choc pneumatique haute puissance pour travaux lourds.',
    rating: 4.6,
    stock: 9,
    featured: false
  },
  {
    id: 12,
    name: 'Scie sauteuse',
    price: 32000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85',
    category: 'Outils électriques',
    description: 'Scie sauteuse professionnelle avec moteur puissant.',
    rating: 4.7,
    stock: 14,
    featured: false
  }
];

// App principal
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductError('');
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Erreur au chargement des produits:', error);
        setProductError('Impossible de charger le catalogue. Veuillez réessayer.');
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prev) => {
      if (quantity < 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  // Rendu des pages
  if (currentPage === 'products') {
    return (
      <div className="flex min-h-dvh min-h-screen w-full flex-col overflow-x-hidden bg-white">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          getTotalItems={getTotalItems}
        />
        <main className="min-w-0 w-full flex-1 bg-slate-50">
          <ProductsPage
            allProducts={products}
            viewProductDetail={viewProductDetail}
            addToCart={addToCart}
          />
        </main>
      </div>
    );
  }

  if (currentPage === 'product-detail' && selectedProduct) {
    return (
      <div className="flex min-h-dvh min-h-screen w-full flex-col overflow-x-hidden bg-white">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          getTotalItems={getTotalItems}
        />
        <main className="flex w-full min-w-0 flex-1 flex-col bg-slate-50">
          <ProductDetailPage
            selectedProduct={selectedProduct}
            setCurrentPage={setCurrentPage}
            addToCart={addToCart}
          />
        </main>
      </div>
    );
  }

  if (currentPage === 'cart') {
    return (
      <div className="flex min-h-dvh min-h-screen w-full flex-col overflow-x-hidden bg-white">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          getTotalItems={getTotalItems}
        />
        <main className="min-w-0 w-full flex-1 bg-white">
          <CartPage
            cart={cart}
            setCurrentPage={setCurrentPage}
            getTotalPrice={getTotalPrice}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="flex min-h-dvh min-h-screen w-full flex-col overflow-x-hidden bg-white">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          getTotalItems={getTotalItems}
        />
        <main className="min-w-0 w-full flex-1 bg-white">
          <ContactPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Page par défaut
  return (
    <div className="flex min-h-dvh min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getTotalItems={getTotalItems}
      />
      <main className="min-w-0 w-full flex-1">
        <HeroSection setCurrentPage={setCurrentPage} />
        <CategoriesSection setCurrentPage={setCurrentPage} />
        <ProductsSection
          allProducts={products}
          viewProductDetail={viewProductDetail}
          addToCart={addToCart}
        />
      </main>
      <Footer />
    </div>
  );
}
