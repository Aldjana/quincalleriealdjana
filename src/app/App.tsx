import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initMetaPixel, metaPixelEvents } from '../config/metaPixel';
import { useProducts } from '../hooks/useProducts';

// Composants de la page d'accueil (chargés immédiatement)
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductsSection } from './components/ProductsSection';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { CartProvider } from './context/CartContext';

// Pages secondaires : chargées à la demande pour alléger le premier affichage
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const OrderConfirmationPage = lazy(() =>
  import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage }))
);

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
  const { products, isLoading } = useProducts();

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      {isLoading && products.length === 0 ? (
        <PageLoader label="Chargement des produits..." />
      ) : (
        <ProductsSection allProducts={products} />
      )}
    </>
  );
}

export default function App() {
  const location = useLocation();
  const showFooter = !['/products', '/product', '/cart', '/order-confirmation'].some(path => location.pathname.startsWith(path));
  const mainClass = location.pathname === '/cart' || location.pathname === '/contact' || location.pathname === '/order-confirmation' ? 'bg-white' : 'bg-slate-50';

  // Initialiser Meta Pixel au montage du composant
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Tracker PageView à chaque changement de route
  useEffect(() => {
    metaPixelEvents.pageView();
  }, [location.pathname]);

  return (
    <CartProvider>
      <AppLayout mainClass={mainClass} showFooter={showFooter}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </CartProvider>
  );
}
