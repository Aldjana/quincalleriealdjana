import type { OrderStatus } from '../../config/api';

export const ORDER_STATUS: Record<OrderStatus, { label: string; badge: string; dot: string }> = {
  nouvelle: { label: 'Nouvelle', badge: 'bg-orange-500/15 text-orange-300 ring-orange-500/30', dot: 'bg-orange-400' },
  confirmee: { label: 'Confirmée', badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30', dot: 'bg-sky-400' },
  en_livraison: { label: 'En livraison', badge: 'bg-violet-500/15 text-violet-300 ring-violet-500/30', dot: 'bg-violet-400' },
  livree: { label: 'Livrée', badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30', dot: 'bg-emerald-400' },
  annulee: { label: 'Annulée', badge: 'bg-slate-500/15 text-slate-400 ring-slate-500/30', dot: 'bg-slate-500' },
};

export const ORDER_STATUS_LIST = Object.keys(ORDER_STATUS) as OrderStatus[];
