import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, PhoneCall } from 'lucide-react';
import type { PlacedOrder } from '../../services/orders';
import { SHOP, whatsappLink } from '../../config/shop';
import { formatPrice } from '../../utils/format';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';

export const OrderConfirmationPage = () => {
  const order = (useLocation().state as { order?: PlacedOrder } | null)?.order;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-900 sm:text-3xl">Merci pour votre commande !</h1>
        {order ? (
          <p className="mt-2 text-slate-600">
            Commande <span className="font-semibold text-navy-900">{order.orderNumber}</span> bien reçue.
          </p>
        ) : (
          <p className="mt-2 text-slate-600">Votre commande a bien été reçue.</p>
        )}

        {order && (
          <div className="mt-6 rounded-xl border border-slate-200 text-left">
            <ul className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-slate-700">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 font-bold text-navy-900">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-navy-50 p-4 text-left">
          <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-navy-700" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-navy-900">Prochaine étape :</span> notre équipe vous appelle très bientôt pour
            confirmer la commande et organiser la livraison. Le paiement se fait à la livraison.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/products" className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">
            Continuer mes achats
          </Link>
          <a
            href={whatsappLink(order ? `Bonjour ${SHOP.name}, je vous contacte au sujet de ma commande ${order.orderNumber}.` : undefined)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};
