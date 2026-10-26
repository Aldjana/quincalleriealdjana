import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, ArrowRight, CreditCard } from 'lucide-react';
import { getProductId } from '../../config/api';
import { metaPixelEvents } from '../../config/metaPixel';
import { useCart } from '../context/CartContext';
import { OrderFormModal } from '../components/OrderFormModal';
import { useOrder } from '../../hooks/useOrder';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { placeOrder, isSubmitting } = useOrder(clearCart);

  const handleOrderClick = () => {
    setShowOrderForm(true);
    metaPixelEvents.initiateCheckout(totalPrice, totalItems);
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
                  const itemId = getProductId(item);
                  return (
                    <div key={itemId} className="bg-white border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <h3 className="text-base sm:text-lg text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="text-base sm:text-lg font-bold text-orange-500">{item.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 sm:h-10 sm:w-10"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 sm:h-10 sm:w-10"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right w-full sm:w-auto flex justify-between sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                        <p className="text-base sm:text-lg font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
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
                    <span className="font-semibold text-sm sm:text-base">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
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
                      <span className="text-base sm:text-lg font-bold text-orange-500">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
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

      {showOrderForm && (
        <OrderFormModal
          title="Commander votre panier"
          isSubmitting={isSubmitting}
          onClose={() => setShowOrderForm(false)}
          onSubmit={(customer) => placeOrder(customer, cart.map((item) => ({ product: item, quantity: item.quantity })))}
          summary={
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total à payer :</span>
                <span className="text-lg font-bold text-orange-500">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
