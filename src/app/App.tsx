import { useState, useEffect, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { CartProvider } from './context/CartContext';  

interface AppLayoutProps {
  children: ReactNode;
  mainClass?: string;
  showFooter?: boolean;
}

function AppLayout({
  children,
  mainClass = 'bg-slate-50',
  showFooter = false,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Header />
      <main className={`min-w-0 w-full flex-1 pt-20 sm:pt-24 ${mainClass}`}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      // 1. Charger d'abord le cache immédiatement
      const cachedProducts = localStorage.getItem('cached_products');
      if (cachedProducts) {
        try {
          const parsed = JSON.parse(cachedProducts);
          setProducts(parsed);
          setIsLoading(false);
        } catch (e) {
          console.error('Erreur lecture cache:', e);
        }
      }

      // 2. Charger les données fraîches en arrière-plan
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
        localStorage.setItem('cached_products', JSON.stringify(data));
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur au chargement des produits :', error);
        // Si erreur et pas de cache, on reste en loading
        if (!cachedProducts) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
  }, []);

  if (isLoading && products.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection allProducts={products} />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const showFooter = !['/products', '/product', '/cart'].some(path => location.pathname.startsWith(path));
  const mainClass = location.pathname === '/cart' || location.pathname === '/contact' ? 'bg-white' : 'bg-slate-50';

  return (
    <CartProvider>
      <AppLayout mainClass={mainClass} showFooter={showFooter}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AppLayout>
    </CartProvider>
  );
}
