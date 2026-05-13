import { useState } from 'react';
import { Star, Truck, HeadphonesIcon, ShoppingCart, ChevronDown, ShoppingBag, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../config/emailjs';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating: number;
}

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
    quantity: 1
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
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      quantity: 1
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // Préparer les détails de la commande pour l'email
      const orderDetails = `${selectedProduct.name} - Quantité: ${formData.quantity} - Prix unitaire: ${selectedProduct.price.toLocaleString()} FCFA - Total: ${(selectedProduct.price * formData.quantity).toLocaleString()} FCFA`;
      
      const emailParams = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
        order_details: orderDetails,
        total_amount: (selectedProduct.price * formData.quantity).toLocaleString(),
        order_date: new Date().toLocaleDateString('fr-FR'),
        to_email: EMAILJS_CONFIG.TO_EMAIL
      };
      
      // Envoyer l'email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        emailParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      setShowOrderForm(false);
      setShowNotification(true);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        quantity: 1
      });

      // Masquer la notification après 3 secondes
      setTimeout(() => setShowNotification(false), 3000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  if (!selectedProduct) return null;

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
        <button onClick={() => setCurrentPage('products')} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4 sm:mb-6">
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
          <span className="text-sm sm:text-base">Retour aux produits</span>
        </button>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-gray-100 p-3 sm:p-6 lg:p-8">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="mx-auto max-h-[50vh] w-full object-contain sm:max-h-none"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-balance text-xl font-bold text-[#0a2463] sm:text-2xl md:text-3xl mb-3 sm:mb-4">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center mb-3 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(selectedProduct.rating || 0) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-gray-600 text-sm sm:text-base">({selectedProduct.rating})</span>
            </div>

            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{selectedProduct.description}</p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Catégorie: {selectedProduct.category}</p>

            <div className="mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-orange-500">{selectedProduct.price.toLocaleString()} FCFA</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:px-6 sm:text-base"
              >
                <ShoppingCart className="h-5 w-5 shrink-0" />
                <span>Ajouter au panier</span>
              </button>

              <button
                type="button"
                onClick={handleOrderClick}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:px-6 sm:text-base"
              >
                <ShoppingBag className="h-5 w-5 shrink-0" />
                <span>Commander</span>
              </button>
            </div>
            
            <div className="mt-4 sm:mt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span className="text-sm sm:text-base">Livraison gratuite dès 50,000 FCFA</span>
                </li>
                <li className="flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm sm:text-base">Support client 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulaire de commande */}
        {showOrderForm && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-lg font-bold leading-snug text-[#0a2463] sm:text-xl">
                  <span className="line-clamp-3">Commander : {selectedProduct.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Prix unitaire: <span className="font-bold text-orange-500">{selectedProduct.price.toLocaleString()} FCFA</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-bold text-green-600">{(selectedProduct.price * formData.quantity).toLocaleString()} FCFA</span></p>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="77 123 45 67"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Votre adresse"
                    required
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Confirmer la commande</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Notification de commande envoyée */}
        {showNotification && (
          <div className="fixed left-3 right-3 top-20 z-50 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <ShoppingBag className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900">Commande envoyée!</p>
              <p className="text-sm text-slate-600">Nous vous contacterons prochainement</p>
            </div>
          </div>
        )}

        {showCartNotification && (
          <div className="fixed left-3 right-3 top-20 z-50 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:max-w-sm">
            <ShoppingCart className="mt-0.5 h-6 w-6 shrink-0 text-orange-600" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900">Produit ajouté!</p>
              <p className="text-sm text-slate-600">Le produit a été ajouté à votre panier</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
