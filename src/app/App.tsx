import { useState, useEffect, type ReactNode } from 'react';
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

interface AppLayoutProps {
  children: ReactNode;
  currentPage: string;
  navigateTo: (page: string) => void;
  getTotalItems: () => number;
  mainClass?: string;
  showFooter?: boolean;
}

function AppLayout({
  children,
  currentPage,
  navigateTo,
  getTotalItems,
  mainClass = 'bg-slate-50',
  showFooter = false,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        getTotalItems={getTotalItems}
      />
      <main className={`min-w-0 w-full flex-1 pt-20 sm:pt-24 ${mainClass}`}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Erreur au chargement des produits :', error);
      }
    };

    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === productId);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const navigateTo = (page: string) => {
    if (page === 'home') {
      setSelectedProduct(null);
    }
    setCurrentPage(page);
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

  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <>
          <HeroSection setCurrentPage={navigateTo} />
          <CategoriesSection setCurrentPage={navigateTo} />
          <ProductsSection
            allProducts={products}
            viewProductDetail={viewProductDetail}
            addToCart={addToCart}
          />
        </>
      );
    }

    if (currentPage === 'products') {
      return (
        <ProductsPage
          allProducts={products}
          viewProductDetail={viewProductDetail}
          addToCart={addToCart}
        />
      );
    }

    if (currentPage === 'product-detail') {
      return selectedProduct ? (
        <ProductDetailPage
          selectedProduct={selectedProduct}
          setCurrentPage={setCurrentPage}
          addToCart={addToCart}
        />
      ) : (
        <div className="p-6 text-center text-slate-500">Produit introuvable.</div>
      );
    }

    if (currentPage === 'cart') {
      return (
        <CartPage
          cart={cart}
          setCurrentPage={setCurrentPage}
          getTotalPrice={getTotalPrice}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
        />
      );
    }

    if (currentPage === 'contact') {
      return <ContactPage />;
    }

    return (
      <>
        <HeroSection setCurrentPage={setCurrentPage} />
        <CategoriesSection setCurrentPage={setCurrentPage} />
        <ProductsSection
          allProducts={products}
          viewProductDetail={viewProductDetail}
          addToCart={addToCart}
        />
      </>
    );
  };

  const showFooter = currentPage !== 'products' && currentPage !== 'product-detail' && currentPage !== 'cart';
  const mainClass = currentPage === 'cart' || currentPage === 'contact' ? 'bg-white' : 'bg-slate-50';

  return (
    <AppLayout
      currentPage={currentPage}
      navigateTo={navigateTo}
      getTotalItems={getTotalItems}
      mainClass={mainClass}
      showFooter={showFooter}
    >
      {renderPage()}
    </AppLayout>
  );
}
