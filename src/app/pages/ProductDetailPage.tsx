import { useState } from 'react';
import { Star, Truck, HeadphonesIcon, ShoppingCart, ChevronDown, ShoppingBag, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../config/emailjs';
import { type Product } from '../../config/api';
import { ProductGallery } from '../components/ProductGallery';

interface ProductDetailPageProps {
  selectedProduct: Product | null;
  setCurrentPage: (page: string) => void;
  addToCart: (product: Product) => void;
}

export const ProductDetailPage = ({ selectedProduct, setCurrentPage, addToCart }: ProductDetailPageProps) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: 1,
  });

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 2000);
    }
  };

  const handleOrderClick = () => {
    setShowOrderForm(true);
    setFormData({ customerName: '', customerPhone: '', customerAddress: '', quantity: 1 });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const orderDetails = `${selectedProduct.name} - Quantité: ${formData.quantity} - Prix unitaire: ${selectedProduct.price.toLocaleString()} FCFA - Total: ${(selectedProduct.price * formData.quantity).toLocaleString()} FCFA`;

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: formData.customerAddress,
          order_details: orderDetails,
          total_amount: (selectedProduct.price * formData.quantity).toLocaleString(),
          order_date: new Date().toLocaleDateString('fr-FR'),
          to_email: EMAILJS_CONFIG.TO_EMAIL,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setShowOrderForm(false);
      setShowNotification(true);
      setFormData({ customerName: '', customerPhone: '', customerAddress: '', quantity: 1 });
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      alert("Erreur lors de l'envoi de la commande. Veuillez réessayer.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!selectedProduct) return null;

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
        <button
          onClick={() => setCurrentPage('products')}
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
                {selectedProduct.price.toLocaleString()} FCFA
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
                onClick={handleOrderClick}
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

        {showOrderForm && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-lg font-bold leading-snug text-[#0a2463] sm:text-xl">
                  Commander : {selectedProduct.name}
                </h3>
                <button type="button" onClick={() => setShowOrderForm(false)} className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <input name="customerName" placeholder="Nom complet *" required onChange={handleInputChange} className="w-full rounded-lg border px-3 py-2" />
                <input name="customerPhone" type="tel" placeholder="Téléphone *" required onChange={handleInputChange} className="w-full rounded-lg border px-3 py-2" />
                <input name="customerAddress" placeholder="Adresse *" required onChange={handleInputChange} className="w-full rounded-lg border px-3 py-2" />
                <input name="quantity" type="number" min="1" defaultValue={1} required onChange={handleInputChange} className="w-full rounded-lg border px-3 py-2" />
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-white">
                  <ShoppingBag className="h-5 w-5" />
                  Confirmer la commande
                </button>
              </form>
            </div>
          </div>
        )}

        {showNotification && (
          <div className="fixed left-3 right-3 top-20 z-50 rounded-xl border bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <p className="font-bold text-slate-900">Commande envoyée!</p>
            <p className="text-sm text-slate-600">Nous vous contacterons prochainement</p>
          </div>
        )}

        {showCartNotification && (
          <div className="fixed left-3 right-3 top-20 z-50 rounded-xl border bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <p className="font-bold text-slate-900">Produit ajouté!</p>
            <p className="text-sm text-slate-600">Le produit a été ajouté à votre panier</p>
          </div>
        )}
      </div>
    </div>
  );
};
