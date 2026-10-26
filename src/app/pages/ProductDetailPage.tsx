import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, HeadphonesIcon, ShoppingCart, ChevronDown, ShoppingBag } from 'lucide-react';
import { getProductId } from '../../config/api';
import { metaPixelEvents } from '../../config/metaPixel';
import { useProduct } from '../../hooks/useProducts';
import { useOrder } from '../../hooks/useOrder';
import { ProductGallery } from '../components/ProductGallery';
import { OrderFormModal } from '../components/OrderFormModal';
import { useCart } from '../context/CartContext';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { product: selectedProduct, isLoading } = useProduct(id);
  const { placeOrder, isSubmitting } = useOrder();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // ViewContent une seule fois par produit consulté
  const trackedId = selectedProduct ? getProductId(selectedProduct) : null;
  useEffect(() => {
    if (selectedProduct && trackedId) {
      metaPixelEvents.viewContent(selectedProduct.name, trackedId, selectedProduct.price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedId]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  if (isLoading && !selectedProduct) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold text-slate-800">Produit introuvable</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Voir tous les produits
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
        <button
          onClick={() => navigate('/products')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-orange-500 sm:mb-6"
        >
          <ChevronDown className="h-4 w-4 rotate-90 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Retour aux produits</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <ProductGallery product={selectedProduct} />

          <div className="min-w-0 lg:py-4">
            <h1 className="mb-3 text-balance text-xl font-bold text-[#0a2463] sm:mb-4 sm:text-2xl md:text-3xl">
              {selectedProduct.name}
            </h1>

            <div className="mb-3 flex items-center sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(selectedProduct.rating || 0) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600 sm:text-base">({selectedProduct.rating})</span>
            </div>

            <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">{selectedProduct.description}</p>
            <p className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm">Catégorie: {selectedProduct.category}</p>

            <div className="mb-4 sm:mb-6">
              <span className="text-2xl font-bold text-orange-500 sm:text-3xl">
                {selectedProduct.price.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:px-6 sm:text-base"
              >
                <ShoppingCart className="h-5 w-5 shrink-0" />
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={() => setShowOrderForm(true)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:px-6 sm:text-base"
              >
                <ShoppingBag className="h-5 w-5 shrink-0" />
                Commander
              </button>
            </div>

            <div className="mt-4 sm:mt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-500" />
                  <span className="text-sm sm:text-base">Livraison gratuite dès 50,000 FCFA</span>
                </li>
                <li className="flex items-center gap-2">
                  <HeadphonesIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm sm:text-base">Support client 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {showOrderForm && (
          <OrderFormModal
            title={`Commander : ${selectedProduct.name}`}
            isSubmitting={isSubmitting}
            onClose={() => setShowOrderForm(false)}
            onSubmit={(customer) => placeOrder(customer, [{ product: selectedProduct, quantity: 1 }])}
          />
        )}

        {showCartNotification && (
          <div className="fixed left-3 right-3 top-20 z-[10001] rounded-xl border bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <p className="font-bold text-slate-900">Produit ajouté!</p>
            <p className="text-sm text-slate-600">Le produit a été ajouté à votre panier</p>
          </div>
        )}
      </div>
    </div>
  );
};
