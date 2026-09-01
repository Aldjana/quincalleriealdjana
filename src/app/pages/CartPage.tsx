import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../config/emailjs';
import { metaPixelEvents } from '../../config/metaPixel';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: ''
  });

  const handleOrderClick = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: ''
    });
    setShowOrderForm(true);
    
    // Tracker InitiateCheckout
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    metaPixelEvents.initiateCheckout(getTotalPrice(), totalItems);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Générer un ID de commande unique pour la déduplication
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Préparer les détails de la commande pour l'email
      const orderDetails = cart.map(item => 
        `${item.name} - Quantité: ${item.quantity} - Prix: ${item.price.toLocaleString()} FCFA - Total: ${(item.price * item.quantity).toLocaleString()} FCFA`
      ).join('\n');
      
      const emailParams = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
        order_details: orderDetails,
        total_amount: getTotalPrice().toLocaleString(),
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
      
      // Marquer que Purchase a été tracké pour éviter les doublons
      sessionStorage.setItem('purchase_tracked', 'true');
      
      // Envoyer l'événement Purchase à Meta Pixel
      const totalAmount = getTotalPrice();
      metaPixelEvents.purchase(totalAmount, orderId);
      
      setShowNotification(true);
      setShowOrderForm(false);
      setTimeout(() => setShowNotification(false), 3000);

      clearCart();
      
      // Rediriger vers la page de confirmation
      navigate('/order-confirmation');
      
    } catch (error) {
      console.error('Erreur détaillée lors de l\'envoi de l\'email:', error);
      
      // Afficher des détails sur l'erreur
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      // Vérifier si c'est une erreur EmailJS spécifique
      if (typeof error === 'object' && error !== null) {
        console.error('Détails de l\'erreur EmailJS:', JSON.stringify(error, null, 2));
      }
      
      alert(`Erreur lors de l\'envoi de la commande: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez réessayer.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full min-w-0 flex-1 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <h1 className="text-2xl sm:text-3xl text-[#0a2463] mb-6 sm:mb-8">Mon panier</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl text-gray-600 mb-4">Votre panier est vide</h2>
            <button onClick={() => navigate('/products')} className="px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base">
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <div key={itemId} className="bg-white border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <h3 className="text-base sm:text-lg text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="text-base sm:text-lg font-bold text-orange-500">{item.price.toLocaleString()} FCFA</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => itemId !== undefined && updateQuantity(itemId, item.quantity - 1)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 sm:h-10 sm:w-10"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => itemId !== undefined && updateQuantity(itemId, item.quantity + 1)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 sm:h-10 sm:w-10"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right w-full sm:w-auto flex justify-between sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                        <p className="text-base sm:text-lg font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                        <button
                          type="button"
                          onClick={() => itemId !== undefined && removeFromCart(itemId)}
                          aria-label="Retirer du panier"
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#0a2463] mb-3 sm:mb-4">Récapitulatif</h3>
                
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div key="subtotal" className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Sous-total</span>
                    <span className="font-semibold text-sm sm:text-base">{getTotalPrice().toLocaleString()} FCFA</span>
                  </div>
                  <div key="delivery" className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Livraison</span>
                    <span className="font-semibold text-sm sm:text-base">Gratuite</span>
                  </div>
                  <div key="tax" className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">TVA</span>
                    <span className="font-semibold text-sm sm:text-base">0 FCFA</span>
                  </div>
                  <div key="total" className="border-t pt-2 sm:pt-3">
                    <div className="flex justify-between">
                      <span className="text-base sm:text-lg font-bold text-[#0a2463]">Total</span>
                      <span className="text-base sm:text-lg font-bold text-orange-500">{getTotalPrice().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <button onClick={handleOrderClick} className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Commander</span>
                  </button>
                  <button onClick={() => navigate('/products')} className="w-full px-4 sm:px-6 py-2 sm:py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                    <span>Continuer mes achats</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de commande */}
        {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Commander votre panier</h2>
              <button
                onClick={() => setShowOrderForm(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Votre adresse"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total à payer:</span>
                  <span className="text-lg font-bold text-orange-500">{getTotalPrice().toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Confirmer la commande</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed left-3 right-3 top-20 z-50 flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg sm:left-auto sm:right-4 sm:max-w-md">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm sm:text-base">Commande envoyée!</span>
        </div>
      )}
    </div>
  );
};
