import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, Truck } from 'lucide-react';
import { getProductId } from '../../config/api';
import { SHOP, whatsappLink } from '../../config/shop';
import { metaPixelEvents } from '../../config/metaPixel';
import { formatPrice } from '../../utils/format';
import { useCart } from '../context/CartContext';
import { OrderFormModal } from '../components/OrderFormModal';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useOrder } from '../../hooks/useOrder';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { placeOrder, isSubmitting } = useOrder(clearCart);

  const freeDelivery = SHOP.freeDeliveryFrom > 0 && totalPrice >= SHOP.freeDeliveryFrom;
  const remainingForFree = SHOP.freeDeliveryFrom - totalPrice;

  const handleOrderClick = () => {
    setShowOrderForm(true);
    metaPixelEvents.initiateCheckout(totalPrice, totalItems);
  };

  const whatsappMessage = [
    `Bonjour ${SHOP.name}, je souhaite commander :`,
    ...cart.map((item) => `- ${item.quantity} × ${item.name} (${formatPrice(item.price * item.quantity)})`),
    `Total : ${formatPrice(totalPrice)}`,
  ].join('\n');

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingCart className="h-9 w-9" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-900">Votre panier est vide</h1>
        <p className="mt-2 text-slate-600">Parcourez notre catalogue et ajoutez vos produits.</p>
        <Link to="/products" className="mt-6 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Panier' }]} />
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
        Mon panier <span className="text-lg font-medium text-slate-500">({totalItems} article{totalItems > 1 ? 's' : ''})</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <ul className="min-w-0 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {cart.map((item) => {
            const itemId = getProductId(item);
            return (
              <li key={itemId} className="relative flex gap-3 p-4 sm:gap-4">
                <Link to={`/product/${itemId}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-24 sm:w-24">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 pr-9 sm:pr-0">
                    <Link to={`/product/${itemId}`} className="line-clamp-2 font-semibold text-slate-900 hover:text-brand-600">
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-500">{item.category}</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4 sm:pr-10">
                    <QuantityStepper size="sm" value={item.quantity} onChange={(q) => updateQuantity(itemId, q)} />
                    <p className="whitespace-nowrap text-right font-bold tabular-nums text-navy-900 sm:w-28">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(itemId)}
                  aria-label={`Retirer ${item.name} du panier`}
                  className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:top-1/2 sm:-translate-y-1/2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit min-w-0 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-32">
          <h2 className="text-lg font-bold text-navy-900">Récapitulatif</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Sous-total</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Livraison</dt>
              <dd className={`font-semibold ${freeDelivery ? 'text-emerald-700' : 'text-slate-700'}`}>
                {freeDelivery ? 'Offerte' : 'À confirmer'}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-bold text-navy-900">Total</dt>
              <dd className="font-bold tabular-nums text-navy-900">{formatPrice(totalPrice)}</dd>
            </div>
          </dl>

          {SHOP.freeDeliveryFrom > 0 && !freeDelivery && (
            <p className="flex gap-2 rounded-lg bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200">
              <Truck className="h-4 w-4 shrink-0 text-brand-500" />
              Plus que {formatPrice(remainingForFree)} pour la livraison offerte.
            </p>
          )}

          <button
            type="button"
            onClick={handleOrderClick}
            className="w-full rounded-lg bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Commander
          </button>
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:border-whatsapp hover:text-whatsapp-dark"
          >
            <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
            Commander sur WhatsApp
          </a>
          <Link to="/products" className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" />
            Continuer mes achats
          </Link>
        </aside>
      </div>

      {showOrderForm && (
        <OrderFormModal
          title={`${totalItems} article${totalItems > 1 ? 's' : ''}`}
          isSubmitting={isSubmitting}
          onClose={() => setShowOrderForm(false)}
          onSubmit={(customer) => placeOrder(customer, cart.map((item) => ({ product: item, quantity: item.quantity })))}
          summary={
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Total à payer à la livraison</span>
              <span className="text-lg font-bold text-navy-900">{formatPrice(totalPrice)}</span>
            </div>
          }
        />
      )}
    </div>
  );
};
