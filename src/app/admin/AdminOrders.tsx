import { useMemo, useState } from 'react';
import { ChevronDown, MapPin, Phone, Search, Trash2, StickyNote, Save, ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '../../config/api';
import { formatDate, formatPrice, normalize } from '../../utils/format';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { ORDER_STATUS, ORDER_STATUS_LIST } from './orderStatus';

interface AdminOrdersProps {
  orders: Order[];
  unavailable: boolean;
  onUpdate: (id: string, data: { status?: OrderStatus; adminNote?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const toWhatsAppNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 9 ? `221${digits}` : digits; // numéros sénégalais sans indicatif
};

export const AdminOrders = ({ orders, unavailable, onUpdate, onDelete }: AdminOrdersProps) => {
  const [filter, setFilter] = useState<OrderStatus | 'toutes'>('toutes');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER_STATUS_LIST.map((s) => [s, 0])) as Record<OrderStatus, number>;
    orders.forEach((o) => c[o.status]++);
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const term = normalize(search);
    return orders.filter(
      (o) =>
        (filter === 'toutes' || o.status === filter) &&
        (!term || normalize(`${o.orderNumber} ${o.customer.name} ${o.customer.phone} ${o.customer.address}`).includes(term))
    );
  }, [orders, filter, search]);

  if (unavailable) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">
        Les commandes sont stockées dans MongoDB, qui est actuellement injoignable. Les commandes continuent d'arriver par email.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <FilterTab label="Toutes" count={orders.length} active={filter === 'toutes'} onClick={() => setFilter('toutes')} />
          {ORDER_STATUS_LIST.map((s) => (
            <FilterTab key={s} label={ORDER_STATUS[s].label} count={counts[s]} active={filter === s} onClick={() => setFilter(s)} dot={ORDER_STATUS[s].dot} />
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N°, nom, téléphone…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500 lg:w-72"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-slate-500">
          <ShoppingBag className="mb-3 h-10 w-10 text-slate-700" />
          {orders.length === 0 ? 'Aucune commande pour le moment' : 'Aucune commande ne correspond'}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              open={openId === order._id}
              onToggle={() => setOpenId((id) => (id === order._id ? null : order._id))}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

function OrderRow({
  order,
  open,
  onToggle,
  onUpdate,
  onDelete,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
  onUpdate: AdminOrdersProps['onUpdate'];
  onDelete: AdminOrdersProps['onDelete'];
}) {
  const [note, setNote] = useState(order.adminNote ?? '');
  const [saving, setSaving] = useState(false);
  const status = ORDER_STATUS[order.status];
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    try {
      await action();
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className={`overflow-hidden rounded-2xl border bg-slate-900/60 transition ${order.status === 'nouvelle' ? 'border-orange-500/40' : 'border-slate-800'}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-white">{order.orderNumber}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${status.badge}`}>{status.label}</span>
          </div>
          <p className="mt-1 truncate text-sm text-slate-400">
            {order.customer.name} · {order.customer.phone} · {itemCount} article{itemCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-emerald-400">{formatPrice(order.total)}</p>
          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="grid gap-5 border-t border-slate-800 px-4 py-5 sm:px-5 lg:grid-cols-2">
          <div className="space-y-4">
            <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800">
              {order.items.map((item) => (
                <li key={item.product} className="flex items-center gap-3 p-3">
                  {item.image && <img src={item.image} alt="" className="h-11 w-11 rounded-lg object-cover ring-1 ring-slate-700" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
              <li className="flex justify-between p-3 text-sm font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </li>
            </ul>

            <div className="space-y-2 rounded-xl bg-slate-800/40 p-4 text-sm">
              <p className="font-semibold text-white">{order.customer.name}</p>
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                {order.customer.address}
              </p>
              {order.customer.note && (
                <p className="flex items-start gap-2 text-slate-300">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  {order.customer.note}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <a href={`tel:${order.customer.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-600">
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${toWhatsAppNumber(order.customer.phone)}?text=${encodeURIComponent(`Bonjour ${order.customer.name}, concernant votre commande ${order.orderNumber} chez Quincaillerie Aldjana : `)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-300">Statut de la commande</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ORDER_STATUS_LIST.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={saving || s === order.status}
                    onClick={() => run(() => onUpdate(order._id, { status: s }))}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 transition disabled:cursor-default ${
                      s === order.status ? ORDER_STATUS[s].badge : 'bg-slate-800/60 text-slate-400 ring-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {ORDER_STATUS[s].label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-300">
              Note interne
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Ex : livraison prévue mardi, client rappelé…"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-normal text-white outline-none placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving || note === (order.adminNote ?? '')}
                onClick={() => run(() => onUpdate(order._id, { adminNote: note }))}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                Enregistrer la note
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => window.confirm(`Supprimer définitivement la commande ${order.orderNumber} ?`) && run(() => onDelete(order._id))}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function FilterTab({ label, count, active, onClick, dot }: { label: string; count: number; active: boolean; onClick: () => void; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
        active ? 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30' : 'bg-slate-900 text-slate-400 ring-1 ring-slate-800 hover:text-white'
      }`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      {label}
      <span className="rounded-full bg-slate-800 px-1.5 text-xs text-slate-300">{count}</span>
    </button>
  );
}
