import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Loader2, ShieldCheck, X } from 'lucide-react';
import type { CustomerInfo } from '../../services/orders';

interface OrderFormModalProps {
  title: string;
  summary?: ReactNode;
  isSubmitting: boolean;
  onSubmit: (customer: CustomerInfo) => void;
  onClose: () => void;
}

const CUSTOMER_STORAGE_KEY = 'customer_info';

// Pré-remplit le formulaire avec les coordonnées de la dernière commande
function loadCustomer(): CustomerInfo {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) ?? 'null');
    if (saved && typeof saved === 'object') return { ...saved, customerNote: '' };
  } catch {
    /* ignore */
  }
  return { customerName: '', customerPhone: '', customerAddress: '', customerNote: '' };
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/15 sm:text-sm';

export const OrderFormModal = ({ title, summary, isSubmitting, onSubmit, onClose }: OrderFormModalProps) => {
  const [formData, setFormData] = useState<CustomerInfo>(loadCustomer);

  // Fermeture avec la touche Échap + blocage du défilement de la page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isSubmitting && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [isSubmitting, onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const { customerName, customerPhone, customerAddress } = formData;
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({ customerName, customerPhone, customerAddress }));
    } catch {
      /* ignore */
    }
    onSubmit(formData);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-slate-900/50" onClick={() => !isSubmitting && onClose()} />
      <div className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-navy-900">Finaliser la commande</h2>
            <p className="truncate text-sm text-slate-500">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <label className="block text-sm font-medium text-slate-700">
            Nom complet *
            <input name="customerName" value={formData.customerName} onChange={handleChange} required minLength={2} autoComplete="name" placeholder="Ex : Moussa Ndiaye" className={inputClass} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Téléphone *
            <input
              name="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              autoComplete="tel"
              inputMode="tel"
              pattern="[0-9+ ().-]{7,20}"
              title="Numéro de téléphone valide"
              placeholder="Ex : 77 123 45 67"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Adresse de livraison *
            <input name="customerAddress" value={formData.customerAddress} onChange={handleChange} required minLength={3} autoComplete="street-address" placeholder="Quartier, ville, repère" className={inputClass} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Précisions <span className="font-normal text-slate-400">(facultatif)</span>
            <textarea name="customerNote" value={formData.customerNote} onChange={handleChange} rows={2} maxLength={500} placeholder="Horaire de livraison, détails…" className={inputClass} />
          </label>

          {summary}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              'Confirmer la commande'
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Aucun paiement en ligne — nous vous appelons pour confirmer.
          </p>
        </form>
      </div>
    </div>
  );
};
