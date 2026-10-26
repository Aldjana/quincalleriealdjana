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
import { WhatsAppButton } from './components/WhatsAppButton';
import { PageLoader } from './components/PageLoader';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Header />
      {/* Hauteur de l'en-tête fixe : 64px mobile, 36px de bandeau + 72px dès sm */}
      <main className="w-full min-w-0 flex-1 pt-16 sm:pt-[108px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function HomePage() {
  const { products, isLoading } = useProducts();

  return (
    <>
      <HeroSection />
      <CategoriesSection products={products} />
      <ProductsSection allProducts={products} isLoading={isLoading} />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  // Initialiser Meta Pixel au montage du composant
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Tracker PageView à chaque changement de route
  useEffect(() => {
    metaPixelEvents.pageView();
  }, [location.pathname]);

  return (
    <ToastProvider>
      <CartProvider>
        <ScrollToTop />
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </CartProvider>
    </ToastProvider>
  );
}
